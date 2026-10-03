"""Shared completed-session selection and the rolling activity assumption."""
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import noload

from app.models.tracking import SportType, Workout, WorkoutLog


def active_completed_workouts(db, uid, start, end):
    # Match the energy report's ID-first and legacy sport-name behavior.
    sports = list(db.scalars(select(SportType).where(SportType.user_id.in_([uid, "__system__"]))))
    sport_by_id = {sport.id: sport for sport in sports}
    active_by_name = {}
    for sport in sports:
        active_by_name[sport.name] = active_by_name.get(sport.name, False) or sport.is_active
    plans = db.scalars(select(Workout).options(noload(Workout.exercise_rows)).join(
        WorkoutLog, WorkoutLog.workout_id == Workout.id).where(
        Workout.user_id == uid, WorkoutLog.user_id == uid, Workout.day.between(start, end))).unique().all()
    return [plan for plan in plans if (
        bool(sport_by_id.get(plan.sport_type_id) and sport_by_id[plan.sport_type_id].is_active)
        if plan.sport_type_id is not None else active_by_name.get(plan.sport, True))]


def summarize_activity(profile, today, plans):
    from app.services.profile import activity_level_for_sessions
    start = today - timedelta(days=6)
    window = [plan for plan in plans if start <= plan.day <= today]
    count = len(window)
    missing = sum(plan.duration_minutes is None for plan in window)
    level = activity_level_for_sessions(count)
    return {"source": "sessions", "activity_level": level,
            "eligible_sessions_7": count, "start": start.isoformat(), "end": today.isoformat(),
            "missing_duration_sessions": missing}


def activity_summary(db, profile, today):
    plans = active_completed_workouts(db, profile.user_id, today - timedelta(days=6), today) if profile else []
    return summarize_activity(profile, today, plans)
