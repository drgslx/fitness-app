from copy import deepcopy
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row, validate_date_range
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import Workout, WorkoutLog, WorkoutTemplate
from app.models.profile import UserProfile
from app.schemas.tracking import WorkoutIn, WorkoutCompletionIn
from app.training.energy_fields import validate_session, ENERGY_FIELDS
from app.services.energy import refresh_energy_goal, reopen_days


router = APIRouter(tags=["training-sessions"])


def session_snapshot(plan):
    return {
        "title": plan.title, "sport": plan.sport, "notes": plan.notes,
        "exercises": deepcopy(plan.exercises),
        "activity_type": plan.activity_type,
        "duration_minutes": plan.duration_minutes, "intensity": plan.intensity,
        "steps_included": plan.steps_included,
    }


def locked_session(db, item_id, user):
    plan = db.scalar(select(Workout).where(
        Workout.id == item_id, Workout.user_id == user["uid"]
    ).with_for_update())
    if plan is None:
        raise HTTPException(status_code=404, detail="Not found")
    return plan


def current_training_day(db, uid):
    from app.api.profile import today_for
    return today_for(db.get(UserProfile, uid))


@router.get("/workouts")
def workouts(
    start: date,
    end: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_date_range(start, end)
    today = current_training_day(db, user["uid"])
    plans = db.scalars(
        select(Workout)
        .where(
            Workout.user_id == user["uid"],
            Workout.day.between(start, end),
        )
        .order_by(Workout.day, Workout.id)
    ).all()
    completed = set(
        db.scalars(
            select(WorkoutLog.workout_id).where(
                WorkoutLog.user_id == user["uid"]
            )
        ).all()
    )
    return [
        {**row(plan), "completed": plan.id in completed and plan.day <= today,
         "has_completion": plan.id in completed, "can_complete": plan.day <= today}
        for plan in plans
    ]


@router.post("/workouts", status_code=201)
def add_workout(
    data: WorkoutIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    values = validate_session(db, user["uid"], data.model_dump())
    save_as_template = values.pop("save_as_template", False)
    template_name = values.pop("template_name", None)

    workout = Workout(user_id=user["uid"], **values)
    db.add(workout)

    if save_as_template:
        final_template_name = (template_name or values["title"]).strip()
        if not final_template_name:
            raise HTTPException(
                status_code=422,
                detail="Template name is required",
            )
        db.add(
            WorkoutTemplate(
                user_id=user["uid"],
                name=final_template_name,
                sport=values["sport"],
                **{key: values.get(key) for key in ENERGY_FIELDS},
                notes=values["notes"],
                exercises=values["exercises"],
            )
        )

    db.commit()
    db.refresh(workout)
    return row(workout)


@router.put("/workouts/{item_id}")
def edit_workout(
    item_id: int,
    data: WorkoutIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    plan = locked_session(db, item_id, user)
    previous_day = plan.day
    log = db.scalar(select(WorkoutLog).where(
        WorkoutLog.workout_id == item_id, WorkoutLog.user_id == user["uid"]
    ))
    if log and data.day > current_training_day(db, user["uid"]):
        raise HTTPException(422, "Anuleaza executarea inainte de a muta sesiunea la o data viitoare.")
    save_as_template = data.save_as_template
    template_name = data.template_name
    values = data.model_dump(
        exclude={"save_as_template", "template_name"}
    )
    values = validate_session(db, user["uid"], values)
    for key, value in values.items():
        setattr(plan, key, value)

    if save_as_template:
        final_template_name = (template_name or values["title"]).strip()
        if not final_template_name:
            raise HTTPException(
                status_code=422,
                detail="Template name is required",
            )
        db.add(
            WorkoutTemplate(
                user_id=user["uid"],
                name=final_template_name,
                sport=values["sport"],
                **{key: values.get(key) for key in ENERGY_FIELDS},
                notes=values["notes"],
                exercises=deepcopy(values["exercises"]),
            )
        )

    if log:
        log.day = plan.day
        log.snapshot = session_snapshot(plan)
    reopen_days(db, user["uid"], previous_day, plan.day)
    refresh_energy_goal(db, user["uid"])
    # Editing a completed session updates its report in the same transaction.
    db.commit()
    db.refresh(plan)
    return row(plan)


@router.delete("/workouts/{item_id}", status_code=204)
def remove_workout(
    item_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    plan = locked_session(db, item_id, user)
    log = db.scalar(select(WorkoutLog).where(
        WorkoutLog.workout_id == item_id, WorkoutLog.user_id == user["uid"]
    ))
    if log:
        db.delete(log)
    db.delete(plan)
    reopen_days(db, user["uid"], plan.day)
    refresh_energy_goal(db, user["uid"])
    db.commit()


@router.put("/workouts/{item_id}/completion")
def complete(
    item_id: int,
    data: WorkoutCompletionIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    plan = locked_session(db, item_id, user)
    if plan.day > current_training_day(db, user["uid"]):
        raise HTTPException(422, "Poti marca executata doar o sesiune de azi sau din trecut.")
    log = db.scalar(
        select(WorkoutLog).where(
            WorkoutLog.workout_id == item_id, WorkoutLog.user_id == user["uid"]
        )
    )
    if log is not None and plan.duration_minutes == data.duration_minutes and plan.intensity == data.intensity:
        return row(log)
    plan.duration_minutes = data.duration_minutes
    plan.intensity = data.intensity
    if log is None:
        log = WorkoutLog(
            workout_id=plan.id,
            user_id=user["uid"],
            day=plan.day,
            snapshot=session_snapshot(plan),
        )
    else:
        log.snapshot = session_snapshot(plan)
    db.add(log)
    reopen_days(db, user["uid"], plan.day)
    refresh_energy_goal(db, user["uid"])
    db.commit()
    db.refresh(log)
    return row(log)


@router.delete("/workouts/{item_id}/completion", status_code=204)
def uncomplete(
    item_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    plan = locked_session(db, item_id, user)
    log = db.scalar(
        select(WorkoutLog).where(
            WorkoutLog.workout_id == item_id,
            WorkoutLog.user_id == user["uid"],
        )
    )
    if log:
        db.delete(log)
        plan.duration_minutes = None
        plan.intensity = None
        reopen_days(db, user["uid"], plan.day)
        refresh_energy_goal(db, user["uid"])
        db.commit()


@router.get("/workout-history")
def history(
    start: date,
    end: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_date_range(start, end)
    items = db.scalars(
        select(WorkoutLog)
        .where(
            WorkoutLog.user_id == user["uid"],
            WorkoutLog.day.between(start, end),
            WorkoutLog.day <= current_training_day(db, user["uid"]),
        )
        .order_by(WorkoutLog.day)
    )
    return [row(item) for item in items]
