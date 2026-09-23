from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import ExerciseDefinition
from app.schemas.tracking import ExerciseDefinitionIn
from app.training.dependencies import SYSTEM_CATALOG_UID, readable_sport


router = APIRouter(tags=["training-exercises"])


@router.get("/sport-types/{sport_id}/exercises")
def exercise_definitions(
    sport_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    readable_sport(db, sport_id, user)

    items = db.scalars(
        select(ExerciseDefinition)
        .where(
            ExerciseDefinition.sport_type_id == sport_id,
            ExerciseDefinition.user_id.in_([
                user["uid"],
                SYSTEM_CATALOG_UID,
            ]),
            ExerciseDefinition.is_active.is_(True),
        )
        .order_by(ExerciseDefinition.user_id, ExerciseDefinition.name)
    ).all()

    return [
        {
            **row(item),
            "is_system": item.user_id == SYSTEM_CATALOG_UID,
        }
        for item in items
    ]


@router.post("/sport-types/{sport_id}/exercises", status_code=201)
def add_exercise_definition(
    sport_id: int,
    data: ExerciseDefinitionIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    readable_sport(db, sport_id, user)

    existing = db.scalar(
        select(ExerciseDefinition).where(
            ExerciseDefinition.sport_type_id == sport_id,
            func.lower(ExerciseDefinition.name) == data.name.lower(),
        )
    )
    if existing:
        raise HTTPException(
            status_code=409,
            detail="Exercise already exists for this sport",
        )

    return save(
        db,
        ExerciseDefinition(
            user_id=user["uid"],
            sport_type_id=sport_id,
            name=data.name,
            tracking_type=data.tracking_type,
        ),
    )


@router.delete("/exercises/{exercise_id}", status_code=204)
def delete_exercise_definition(
    exercise_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    exercise = db.get(ExerciseDefinition, exercise_id)
    if exercise is None:
        raise HTTPException(status_code=404, detail="Exercise not found")
    if exercise.user_id == SYSTEM_CATALOG_UID:
        raise HTTPException(
            status_code=403,
            detail="Standard exercises cannot be deleted",
        )
    if exercise.user_id != user["uid"] and user.get("admin") is not True:
        raise HTTPException(status_code=403, detail="Forbidden")

    exercise.is_active = False
    db.commit()
