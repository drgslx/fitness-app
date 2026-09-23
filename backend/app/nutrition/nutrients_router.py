from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user, require_admin
from app.db.session import get_db
from app.models.tracking import Nutrient
from app.schemas.tracking import NutrientIn


router = APIRouter(tags=["nutrition-nutrients"])


@router.get("/nutrients")
def nutrients(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    items = db.scalars(select(Nutrient).order_by(Nutrient.key))
    return [row(item) for item in items]


@router.post(
    "/nutrients",
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def add_nutrient(
    data: NutrientIn,
    db: Session = Depends(get_db),
):
    if db.get(Nutrient, data.key):
        raise HTTPException(status_code=409, detail="Nutrient key exists")
    return save(db, Nutrient(**data.model_dump()))
