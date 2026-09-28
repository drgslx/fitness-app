from datetime import date
from typing import Literal
from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import current_user
from app.db.session import get_db
from app.models.activity import DailyActivity
from app.models.profile import UserProfile
from app.api.profile import today_for, lock_profile, flush, commit
from app.services.activity_catalog import activity_catalog, CATALOG, net_calories
from app.services.energy import energy_report
from app.services.profile import sync_calorie_goal, latest_weight, estimate

router = APIRouter(tags=["activity"])

class ActivityIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    steps: int | None = Field(default=None, ge=0, le=100000, strict=True)
    steps_scope: Literal["total", "outside_workouts"] = "total"
    complete: bool = False

class PreviewIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    day: date
    activity_type: str
    duration_minutes: float = Field(gt=0, le=600, allow_inf_nan=False)
    intensity: Literal["moderate", "high", "very_high"] = "moderate"

@router.get("/activity-types")
def types(user=Depends(current_user)):
    return activity_catalog()

@router.get("/energy")
def energy(response: Response, user=Depends(current_user), db: Session = Depends(get_db)):
    response.headers["Cache-Control"] = "private, no-store"
    profile = db.get(UserProfile, user["uid"])
    if not profile: return {"available": False, "reason": "Salveaza mai intai profilul."}
    return {"available": True, **energy_report(db, profile, today_for(profile))}

@router.put("/daily-activity/{day}")
def save_day(day: date, data: ActivityIn, user=Depends(current_user), db: Session = Depends(get_db)):
    profile = lock_profile(db, user["uid"])
    if not profile: raise HTTPException(409, "Salveaza mai intai profilul.")
    today = today_for(profile)
    if day > today or day < profile.birth_date: raise HTTPException(422, "Data activitatii nu este valida.")
    if data.complete and data.steps is None: raise HTTPException(422, "Completeaza pasii, inclusiv zero, inainte de confirmarea zilei.")
    item = db.scalar(select(DailyActivity).where(DailyActivity.user_id == user["uid"], DailyActivity.day == day))
    if item is None:
        item = DailyActivity(user_id=user["uid"], day=day)
        db.add(item)
    for key, value in data.model_dump().items(): setattr(item, key, value)
    flush(db)
    sync_calorie_goal(db, profile, today)
    commit(db)
    return {"available": True, **energy_report(db, profile, today)}

@router.delete("/daily-activity/{day}", status_code=204)
def delete_day(day: date, user=Depends(current_user), db: Session = Depends(get_db)):
    profile = lock_profile(db, user["uid"])
    item = db.scalar(select(DailyActivity).where(DailyActivity.user_id == user["uid"], DailyActivity.day == day))
    if item is None: raise HTTPException(404, "Activitatea nu exista.")
    db.delete(item)
    flush(db)
    if profile: sync_calorie_goal(db, profile, today_for(profile))
    commit(db)

@router.post("/energy/preview")
def preview(data: PreviewIn, user=Depends(current_user), db: Session = Depends(get_db)):
    if data.activity_type not in CATALOG: raise HTTPException(422, "Tip de activitate necunoscut.")
    profile = db.get(UserProfile, user["uid"])
    if not profile: return {"net_kcal": None, "reason": "Completeaza profilul si greutatea."}
    # A future plan previews against today's weight, never creates a completed record.
    day = min(data.day, today_for(profile))
    weight = latest_weight(db, user["uid"], day)
    result = estimate(profile, weight, day)
    return {"net_kcal": round(net_calories(data.activity_type, data.intensity, data.duration_minutes, weight.weight_kg))
            if result["available"] else None, "reason": result.get("reason"), "method": "net-MET-session-v1"}
