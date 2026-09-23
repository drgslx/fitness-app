from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import WorkoutTemplate
from app.schemas.tracking import WorkoutTemplateIn


router = APIRouter(tags=["training-templates"])


@router.get("/workout-templates")
def list_workout_templates(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    templates = db.scalars(
        select(WorkoutTemplate)
        .where(
            WorkoutTemplate.user_id == user["uid"],
            WorkoutTemplate.is_active.is_(True),
        )
        .order_by(WorkoutTemplate.name)
    ).all()
    return [row(template) for template in templates]


@router.post("/workout-templates", status_code=201)
def create_workout_template(
    payload: WorkoutTemplateIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    template = WorkoutTemplate(
        user_id=user["uid"],
        **payload.model_dump(),
    )
    db.add(template)
    db.commit()
    db.refresh(template)
    return row(template)


@router.delete("/workout-templates/{template_id}", status_code=204)
def delete_workout_template(
    template_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    template = db.get(WorkoutTemplate, template_id)
    if template is None:
        raise HTTPException(status_code=404, detail="Template not found")
    if template.user_id != user["uid"] and user.get("admin") is not True:
        raise HTTPException(status_code=403, detail="Forbidden")

    template.is_active = False
    db.commit()
