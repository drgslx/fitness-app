from copy import deepcopy
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import Workout, WorkoutTemplate
from app.schemas.tracking import WorkoutTemplateIn


router = APIRouter(tags=["training-templates"])


class TemplateUseIn(BaseModel):
    model_config = ConfigDict(extra="forbid")
    day: date


def personal_template(db: Session, template_id: int, user: dict):
    template = db.scalar(
        select(WorkoutTemplate).where(
            WorkoutTemplate.id == template_id,
            WorkoutTemplate.user_id == user["uid"],
            WorkoutTemplate.is_active.is_(True),
        )
    )
    if template is None:
        raise HTTPException(404, "Sablonul nu exista sau nu mai este disponibil.")
    return template


@router.get("/workout-templates/{template_id}")
def get_template(template_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    return row(personal_template(db, template_id, user))


@router.put("/workout-templates/{template_id}")
def update_template(
    template_id: int,
    data: WorkoutTemplateIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    template = personal_template(db, template_id, user)
    # Reassign the JSON column: SQLAlchemy detects the complete replacement.
    for key, value in data.model_dump().items():
        setattr(template, key, deepcopy(value))
    return save(db, template)


@router.post("/workout-templates/{template_id}/sessions", status_code=201)
def use_template(
    template_id: int,
    data: TemplateUseIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    template = personal_template(db, template_id, user)
    # Copy the persisted template, including duplicate exercise IDs and null values.
    # No WorkoutLog is created: the new session starts as planned.
    workout = Workout(
        user_id=user["uid"],
        day=data.day,
        title=template.name,
        sport=template.sport,
        notes=template.notes,
        exercises=deepcopy(template.exercises),
    )
    return save(db, workout)
