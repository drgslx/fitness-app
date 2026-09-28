from copy import deepcopy
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import owned, row, save, validate_date_range
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import Workout, WorkoutLog, WorkoutTemplate
from app.schemas.tracking import WorkoutIn
from app.training.energy_fields import validate_session, ENERGY_FIELDS
from app.services.energy import refresh_energy_goal, reopen_days


router = APIRouter(tags=["training-sessions"])


@router.get("/workouts")
def workouts(
    start: date,
    end: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_date_range(start, end)
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
        {**row(plan), "completed": plan.id in completed}
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
    plan = owned(db, Workout, item_id, user)
    previous_day = plan.day
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

    log = db.scalar(select(WorkoutLog).where(
        WorkoutLog.workout_id == item_id, WorkoutLog.user_id == user["uid"]
    ))
    if log:
        log.day = plan.day
        log.snapshot = {
            "title": plan.title, "sport": plan.sport, "notes": plan.notes,
            "exercises": deepcopy(plan.exercises),
        }
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
    plan = owned(db, Workout, item_id, user)
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
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    plan = owned(db, Workout, item_id, user)
    db.execute(
        select(Workout.id)
        .where(Workout.id == item_id)
        .with_for_update()
    )
    log = db.scalar(
        select(WorkoutLog).where(WorkoutLog.workout_id == item_id)
    )
    if log is not None:
        return row(log)
    if log is None:
        log = WorkoutLog(
            workout_id=plan.id,
            user_id=user["uid"],
            day=plan.day,
            snapshot={
                "title": plan.title,
                "sport": plan.sport,
                "notes": plan.notes,
                "exercises": plan.exercises,
            },
        )
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
    plan = owned(db, Workout, item_id, user)
    log = db.scalar(
        select(WorkoutLog).where(
            WorkoutLog.workout_id == item_id,
            WorkoutLog.user_id == user["uid"],
        )
    )
    if log:
        db.delete(log)
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
        )
        .order_by(WorkoutLog.day)
    )
    return [row(item) for item in items]
