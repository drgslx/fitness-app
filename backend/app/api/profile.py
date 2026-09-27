from datetime import date, datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.common import validate_date_range
from app.core.security import current_user
from app.db.session import get_db
from app.models.profile import BodyWeight, UserProfile
from app.nutrition.reports_router import build_nutrition_report
from app.schemas.profile import ProfileIn, WeightIn
from app.services.profile import profile_payload, sync_calorie_goal
from app.training.progress_router import active_completed_logs

router = APIRouter(tags=["profile"])


def today_for(profile):
    return datetime.now(ZoneInfo(profile.timezone if profile else "Europe/Bucharest")).date()


def lock_profile(db, uid):
    return db.scalar(select(UserProfile).where(UserProfile.user_id == uid).with_for_update())


def commit(db):
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Datele au fost schimbate simultan. Reincarca profilul si incearca din nou.")


def flush(db):
    try:
        db.flush()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Datele au fost schimbate simultan. Reincarca profilul si incearca din nou.")


@router.get("/me")
def me(user=Depends(current_user)):
    return {"uid": user["uid"], "email": user.get("email"), "admin": user.get("admin") is True}


@router.get("/profile")
def get_profile(response: Response, user=Depends(current_user), db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "private, no-store"
    profile = db.get(UserProfile, user["uid"])
    return profile_payload(db, profile, user["uid"], today_for(profile))


@router.put("/profile")
def set_profile(data: ProfileIn, user=Depends(current_user), db: Session = Depends(get_db)):
    profile = lock_profile(db, user["uid"])
    if profile is None:
        profile = UserProfile(user_id=user["uid"])
        db.add(profile)
    for key, value in data.model_dump().items():
        setattr(profile, key, value)
    today = today_for(profile)
    flush(db)
    sync_calorie_goal(db, profile, today)
    commit(db)
    return profile_payload(db, profile, user["uid"], today)


@router.put("/profile/weights")
def set_weight(data: WeightIn, user=Depends(current_user), db: Session = Depends(get_db)):
    profile = lock_profile(db, user["uid"])
    if profile is None:
        raise HTTPException(409, "Salveaza mai intai datele profilului.")
    today = today_for(profile)
    if data.day > today or data.day < profile.birth_date:
        raise HTTPException(422, "Data cantaririi trebuie sa fie intre data nasterii si ziua de azi.")
    weight = db.scalar(select(BodyWeight).where(BodyWeight.user_id == user["uid"], BodyWeight.day == data.day))
    if weight is None:
        weight = BodyWeight(user_id=user["uid"], day=data.day)
        db.add(weight)
    weight.weight_kg = data.weight_kg
    flush(db)
    sync_calorie_goal(db, profile, today)
    commit(db)
    return profile_payload(db, profile, user["uid"], today)


@router.delete("/profile/weights/{weight_id}")
def delete_weight(weight_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    profile = lock_profile(db, user["uid"])
    weight = db.scalar(select(BodyWeight).where(BodyWeight.id == weight_id, BodyWeight.user_id == user["uid"]))
    if profile is None or weight is None:
        raise HTTPException(404, "Masuratoarea nu exista.")
    today = today_for(profile)
    db.delete(weight)
    flush(db)
    sync_calorie_goal(db, profile, today)
    commit(db)
    return profile_payload(db, profile, user["uid"], today)


@router.get("/profile/summary")
def summary(start: date, end: date, response: Response,
            user=Depends(current_user), db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "private, no-store"
    validate_date_range(start, end)
    nutrition = build_nutrition_report(db, user["uid"], start, end)
    logs = {log.id: log for log in active_completed_logs(db, user["uid"], start, end)}.values()
    sports = {}
    for log in logs:
        name = log.snapshot["sport"]
        sports[name] = sports.get(name, 0) + 1
    days = nutrition["days"]
    calories = sum(day["calories"] for day in days)
    compared = [day for day in days if day["target"] is not None]
    return {
        "start": start, "end": end,
        "sessions": sum(sports.values()),
        "sports": [{"name": name, "sessions": count} for name, count in sorted(sports.items())],
        "logged_days": len(days), "entries": sum(day["entries"] for day in days),
        "calories": round(calories, 2),
        "average_calories": round(calories / len(days), 2) if days else None,
        "average_difference": round(sum(day["difference"] for day in compared) / len(compared), 2) if compared else None,
        "days_with_target": len(compared),
    }
