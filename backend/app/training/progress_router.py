from datetime import date
from types import SimpleNamespace
from typing import Literal

from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, or_, select
from sqlalchemy.orm import Session

from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import SportType, Workout, WorkoutLog
from app.training.dependencies import SYSTEM_CATALOG_UID
from app.training.progress_service import build_report, catalog, period_ranges

router = APIRouter(tags=["training-progress"])


def active_completed_logs(db, user_id, start=None, end=None):
    query = (select(WorkoutLog, Workout)
             .join(Workout, WorkoutLog.workout_id == Workout.id)
             .outerjoin(SportType, and_(SportType.name == Workout.sport,
                                        SportType.user_id.in_([user_id, SYSTEM_CATALOG_UID])))
             .where(WorkoutLog.user_id == user_id, Workout.user_id == user_id,
                    or_(SportType.id.is_(None), SportType.is_active.is_(True)))
             .order_by(WorkoutLog.day, WorkoutLog.id))
    if start is not None:
        query = query.where(Workout.day.between(start, end))
    # Read the current completed session, including edits made before this fix.
    return [SimpleNamespace(
        id=log.id, day=plan.day,
        snapshot={"title": plan.title, "sport": plan.sport,
                  "notes": plan.notes, "exercises": plan.exercises or []},
    ) for log, plan in db.execute(query).all()]


@router.get("/training-progress/catalog")
def progress_catalog(user=Depends(current_user), db: Session = Depends(get_db)):
    logs = active_completed_logs(db, user["uid"])
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
    logs = active_completed_logs(db, user["uid"], previous_start, end)
    return build_report(logs, sport, exercise_key, anchor, period)
