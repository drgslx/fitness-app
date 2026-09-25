from datetime import date
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import WorkoutLog
from app.training.progress_service import build_report, catalog, period_ranges

router = APIRouter(tags=["training-progress"])


@router.get("/training-progress/catalog")
def progress_catalog(user=Depends(current_user), db: Session = Depends(get_db)):
    logs = db.scalars(select(WorkoutLog).where(WorkoutLog.user_id == user["uid"])
                      .order_by(WorkoutLog.day, WorkoutLog.id)).all()
    return catalog(logs)


@router.get("/training-progress")
def progress(
    sport: str = Query(min_length=1, max_length=100),
    exercise_key: str = Query(min_length=1, max_length=200),
    anchor: date = Query(),
    period: Literal["week", "month"] = "month",
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    _, end, previous_start, _ = period_ranges(anchor, period)
    logs = db.scalars(select(WorkoutLog).where(
        WorkoutLog.user_id == user["uid"], WorkoutLog.day.between(previous_start, end)
    ).order_by(WorkoutLog.day, WorkoutLog.id)).all()
    return build_report(logs, sport, exercise_key, anchor, period)
