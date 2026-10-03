"""Versioned, read-through energy estimates. No duplicated calorie totals in DB."""
from datetime import timedelta
from sqlalchemy import select
from app.models.activity import DailyActivity
from app.models.profile import BodyWeight
from app.services.activity_catalog import CATALOG, INTENSITIES, net_calories
from app.services.training_activity import active_completed_workouts, summarize_activity

VERSION = "daily-energy-v3"
# Explicit modelling assumptions, not measurements or a validated adaptive TDEE.
NON_WALKING_FRACTION = .10
THERMIC_FRACTION = .10
STEP_LENGTH_HEIGHT_RATIO = .414
WALK_NET_KCAL_KG_KM = .5


def energy_report(db, profile, today, days=28):
    from app.services.profile import estimate, activity_level_for_sessions
    start = today - timedelta(days=days - 1)
    uid = profile.user_id
    movements = {r.day: r for r in db.scalars(select(DailyActivity).where(
        DailyActivity.user_id == uid, DailyActivity.day.between(start, today)))}
    weights = list(db.scalars(select(BodyWeight).where(BodyWeight.user_id == uid,
                   BodyWeight.day <= today).order_by(BodyWeight.day)))
    plans = active_completed_workouts(db, uid, start - timedelta(days=6), today)
    by_day = {}
    for plan in plans:
        by_day.setdefault(plan.day, []).append(plan)
    output = []
    for offset in range(days):
        day = start + timedelta(days=offset)
        observation = movements.get(day)
        weight = next((w for w in reversed(weights) if w.day <= day), None)
        daily_activity = summarize_activity(profile, day, plans)
        base = estimate(profile, weight, day, activity_level_override=daily_activity["activity_level"])
        sessions = by_day.get(day, [])
        issues = []
        entries = []
        total_minutes = sum(p.duration_minutes or 0 for p in sessions)
        for plan in sessions:
            available = bool(base["available"] and plan.activity_type in CATALOG
                             and plan.duration_minutes and plan.intensity in INTENSITIES)
            kcal = net_calories(plan.activity_type, plan.intensity, plan.duration_minutes, weight.weight_kg) if available else None
            entries.append(dict(id=plan.id, title=plan.title, sport=plan.sport, activity_type=plan.activity_type,
                duration_minutes=plan.duration_minutes, intensity=plan.intensity,
                steps_included=plan.steps_included, net_kcal=round(kcal) if kcal is not None else None))
            if not available: issues.append("O sesiune nu are tip energetic, durata, intensitate sau greutate eligibila.")
        if total_minutes > 960: issues.append("Durata cumulata depaseste 16 ore; verifica sesiunile duplicate.")
        steps = observation.steps if observation else None
        walking_steps = steps
        if steps is None: issues.append("Pasii zilei nu sunt completati; lipsa nu inseamna zero.")
        elif observation.steps_scope == "total" and sessions:
            # All sports can generate real or device-reported steps; never guess overlap.
            if any(p.steps_included is None for p in sessions):
                walking_steps = None
                issues.append("Completeaza pasii inclusi in fiecare sesiune sau foloseste pasi din afara antrenamentelor.")
            else:
                included = sum(p.steps_included for p in sessions)
                if included > steps:
                    walking_steps = None
                    issues.append("Pasii sesiunilor depasesc totalul zilnic.")
                else: walking_steps = steps - included
        rest = base.get("resting_kcal")
        walk = (walking_steps * profile.height_cm / 100 * STEP_LENGTH_HEIGHT_RATIO / 1000
                * weight.weight_kg * WALK_NET_KCAL_KG_KM) if base["available"] and walking_steps is not None else None
        workout_kcal = sum(e["net_kcal"] or 0 for e in entries)
        has_data = observation is not None or bool(sessions)
        complete = bool(observation and observation.complete and not issues and base["available"])
        other = rest * NON_WALKING_FRACTION if base["available"] and has_data else None
        subtotal = rest + other + (walk or 0) + workout_kcal if other is not None else None
        thermic = subtotal * THERMIC_FRACTION / (1 - THERMIC_FRACTION) if subtotal is not None else None
        daily_total = round(subtotal + thermic) if subtotal is not None else base.get("maintenance_kcal")
        output.append(dict(day=day.isoformat(), available=base["available"], reason=base.get("reason"),
            activity_summary=daily_activity,
            mode="recorded" if has_data else "fallback", complete=complete,
            observation=dict(steps=steps, steps_scope=observation.steps_scope, complete=observation.complete) if observation else None,
            resting_kcal=rest, weight_day=weight.day.isoformat() if weight else None,
            steps=steps, walking_steps=walking_steps, walking_net_kcal=round(walk) if walk is not None else None,
            sessions=entries, workout_net_kcal=workout_kcal, training_minutes=total_minutes,
            other_baseline_kcal=round(other) if other is not None else None,
            thermic_kcal=round(thermic) if thermic is not None else None,
            estimated_kcal=daily_total, issues=list(dict.fromkeys(issues)),
            stale_weight=bool(weight and (day - weight.day).days >= 30)))
    week = output[-7:]
    training_days = sum(bool(day["sessions"]) for day in week)
    training_sessions = sum(len(day["sessions"]) for day in week)
    completed = [d for d in week if d["complete"]]
    average = round(sum(d["estimated_kcal"] for d in completed) / len(completed)) if completed else None
    all_complete = sum(d["complete"] for d in output)
    usable = len(completed) >= 4
    return dict(method=VERSION, today=output[-1], days=output,
        activity_summary=summarize_activity(profile, today, plans),
        week=dict(start=week[0]["day"], end=week[-1]["day"], complete_days=len(completed),
                  training_days=training_days, activity_level=activity_level_for_sessions(training_sessions),
                  average_maintenance_kcal=average,
                  average_steps=round(sum(d["steps"] for d in completed) / len(completed)) if completed else None,
                  sessions=training_sessions,
                  training_minutes=sum(d["training_minutes"] for d in week)),
        planning_maintenance_kcal=average if usable else None,
        coverage=dict(level="history" if all_complete >= 14 and usable else "improving" if all_complete else "basic",
                      complete_days_28=all_complete, required_days_7=4, calibrated=False),
        assumptions=dict(non_walking_fraction=NON_WALKING_FRACTION, thermic_fraction=THERMIC_FRACTION,
                         step_length_height_ratio=STEP_LENGTH_HEIGHT_RATIO, walking_net_kcal_kg_km=WALK_NET_KCAL_KG_KM))


def refresh_energy_goal(db, uid):
    # Called by mutations only; GETs stay side-effect free.
    from app.models.profile import UserProfile
    from app.api.profile import today_for
    from app.services.profile import sync_calorie_goal
    profile = db.scalar(select(UserProfile).where(UserProfile.user_id == uid).with_for_update())
    db.flush()
    if profile: sync_calorie_goal(db, profile, today_for(profile))


def reopen_days(db, uid, *days):
    db.flush()
    for observation in db.scalars(select(DailyActivity).where(DailyActivity.user_id == uid, DailyActivity.day.in_(days))):
        observation.complete = False
