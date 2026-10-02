"""Estimates from measurements; dated targets are snapshots, never cached reports."""
from datetime import date, timedelta

from sqlalchemy import select

from app.api.common import row
from app.models.profile import BodyWeight
from app.models.tracking import NutritionGoal
from app.services.training_activity import summarize_activity


# Approximate total activity multipliers, including exercise AND daily movement.
# Current completed-session frequency selects this assumption, not signup activity.
ACTIVITY_FACTORS = {"sedentary": 1.2, "light": 1.375, "moderate": 1.55,
                    "high": 1.725, "very_high": 1.9}
FORMULA_VERSION = "mifflin-st-jeor-v1"


def age_on(birth_date, today):
    return today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))


def profile_edit_permissions(profile, today):
    """Use saved identity data for both API enforcement and the profile form."""
    creating = profile is None
    return {
        "sex": creating,
        "birth_date": creating,
        "height_cm": creating or age_on(profile.birth_date, today) < 18,
        "activity_level": creating,
        "goal": True,
    }


def latest_weight(db, uid, today):
    return db.scalar(select(BodyWeight).where(BodyWeight.user_id == uid, BodyWeight.day <= today)
                     .order_by(BodyWeight.day.desc()).limit(1))


def estimate(profile, weight, today, activity_level_override=None):
    result = {"available": False, "reason": "Completeaza profilul si adauga o greutate masurata.",
              "warnings": [], "options": []}
    if profile is None or weight is None:
        return result
    age = age_on(profile.birth_date, today)
    if age < 18:
        result["reason"] = "Estimatorul caloric este disponibil doar pentru adulti (18+)."
        return result
    if profile.pregnant_or_breastfeeding:
        result["reason"] = "In sarcina sau alaptare, stabileste tinta cu un specialist. Calculul automat este oprit."
        return result
    bmi = weight.weight_kg / (profile.height_cm / 100) ** 2
    if profile.goal == "lose" and (bmi < 18.5 or (
            profile.target_weight_kg is not None and profile.target_weight_kg / (profile.height_cm / 100) ** 2 < 18.5)):
        result["reason"] = "Nu calculam deficit pentru o greutate actuala sau tinta sub pragul IMC 18,5. Discuta obiectivul cu un specialist."
        return result

    rest = 10 * weight.weight_kg + 6.25 * profile.height_cm - 5 * age + (5 if profile.sex == "male" else -161)
    activity_level = activity_level_override or profile.activity_level
    maintenance = rest * ACTIVITY_FACTORS[activity_level]
    reached = profile.target_weight_kg is not None and (
        (profile.goal == "lose" and weight.weight_kg <= profile.target_weight_kg) or
        (profile.goal == "gain" and weight.weight_kg >= profile.target_weight_kg))
    goal = "maintain" if reached else profile.goal
    percent = -profile.deficit_percent if goal == "lose" else profile.surplus_percent if goal == "gain" else 0
    target = maintenance * (1 + percent / 100)
    if target < 1000 or rest <= 0:
        result["reason"] = "Rezultatul este prea mic pentru o tinta automata. Verifica datele si cere o evaluare individuala."
        return result

    if (today - weight.day).days >= 30:
        result["warnings"].append("Au trecut cel putin 30 de zile de la ultima cantarire. Adauga o masuratoare noua pentru recalculare.")
    if reached:
        result["warnings"].append("Ai atins greutatea tinta. Recomandarea trece la mentinere; poti seta un obiectiv nou.")
    if goal == "gain":
        result["warnings"].append("Surplusul sustine antrenamentul de forta, dar cresterea in greutate nu reprezinta numai masa musculara.")
    choices = [-10, -15, -20] if goal == "lose" else [5, 10, 15, 20] if goal == "gain" else [0]
    for adjustment in choices:
        calories = maintenance * (1 + adjustment / 100)
        allowed = calories >= 1000
        result["options"].append({
            "percent": adjustment, "calories": round(calories) if allowed else None,
            "allowed": allowed,
            # An energy-equivalent illustration, NOT a physiological weight forecast.
            "energy_equivalent_kg_30_days": round((calories - maintenance) * 30 / 7700, 2)
            if allowed and goal == "lose" else None,
        })
    result.update({
        "available": True, "reason": None, "age": age, "bmi": round(bmi, 1),
        "weight_kg": weight.weight_kg, "weight_day": weight.day.isoformat(),
        "resting_kcal": round(rest), "maintenance_kcal": round(maintenance),
        "target_kcal": round(target), "adjustment_percent": percent, "effective_goal": goal,
        "activity_factor": ACTIVITY_FACTORS[activity_level], "formula": FORMULA_VERSION,
        "target_reached": reached,
        "inputs": {"sex": profile.sex, "age": age, "height_cm": profile.height_cm,
                   "weight_kg": weight.weight_kg, "activity_level": activity_level,
                   "goal": goal, "adjustment_percent": percent},
    })
    return result


def latest_goal(db, uid, today):
    return db.scalar(select(NutritionGoal).where(NutritionGoal.user_id == uid,
                     NutritionGoal.effective_from <= today).order_by(NutritionGoal.effective_from.desc()).limit(1))


def is_valid_goal(goal, day):
    return goal is not None and (goal.valid_until is None or goal.valid_until >= day)


def recommendation(db, profile, today, report=None):
    from app.services.energy import energy_report
    report = report if report is not None else energy_report(db, profile, today) if profile else None
    activity = report["activity_summary"] if report else summarize_activity(profile, today, [])
    result = estimate(profile, latest_weight(db, profile.user_id, today) if profile else None, today,
                      activity_level_override=activity["activity_level"])
    result["maintenance_source"] = "sessions"
    result["complete_days_7"] = report["week"]["complete_days"] if report else 0
    result["energy_method"] = report["method"] if report else None
    return result


def sync_calorie_goal(db, profile, today):
    """Called in the same transaction as profile/weight edits, never from a GET.

    Existing dates stay unchanged. Corrections within today replace today's target,
    matching the existing one-goal-per-user-per-day contract.
    """
    if not profile.auto_calories:
        return
    current = latest_goal(db, profile.user_id, today)
    result = recommendation(db, profile, today)
    if not result["available"]:
        if current and current.source == "profile" and is_valid_goal(current, today):
            # Keep history, but do not serve an obsolete automatic target today.
            current.valid_until = today - timedelta(days=1)
        return
    snapshot = {"formula": result["formula"], **result["inputs"],
                "maintenance_source": result["maintenance_source"], "energy_method": result["energy_method"],
                "maintenance_kcal": result["maintenance_kcal"]}
    if (is_valid_goal(current, today) and current.source == "profile"
            and current.calculation == snapshot and current.calories == result["target_kcal"]):
        return
    protein = current.protein if current else 0
    goal = current if current and current.effective_from == today else NutritionGoal(
        user_id=profile.user_id, effective_from=today)
    goal.goal_type = result["effective_goal"]
    goal.calories = result["target_kcal"]
    goal.protein = protein  # Preserve the user's protein target; do not invent one.
    goal.pace_kg_week = None
    goal.notes = "Tinta calorica estimata din profil. Proteinele pastreaza ultima valoare configurata."
    goal.source = "profile"
    goal.calculation = snapshot
    goal.valid_until = None
    db.add(goal)


def profile_payload(db, profile, uid, today):
    from app.services.energy import energy_report
    weights = db.scalars(select(BodyWeight).where(BodyWeight.user_id == uid, BodyWeight.day <= today)
                         .order_by(BodyWeight.day.desc())).all()
    current = latest_goal(db, uid, today)
    report = energy_report(db, profile, today) if profile else None
    activity = report["activity_summary"] if report else summarize_activity(profile, today, [])
    current_recommendation = recommendation(db, profile, today, report=report)
    return {
        "today": today.isoformat(),
        "profile": {key: value for key, value in row(profile).items() if key != "user_id"} if profile else None,
        "edit_permissions": profile_edit_permissions(profile, today),
        "activity_summary": activity,
        "weights": [{"id": item.id, "day": item.day, "weight_kg": item.weight_kg} for item in weights],
        "recommendation": current_recommendation,
        "active_goal": row(current) if is_valid_goal(current, today) else None,
        "weight_change_kg": round(weights[0].weight_kg - weights[-1].weight_kg, 2) if len(weights) > 1 else None,
    }
