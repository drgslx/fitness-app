from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import SportType
from app.schemas.tracking import SportTypeIn
from app.training.dependencies import SYSTEM_CATALOG_UID


router = APIRouter(tags=["training-sports"])


@router.get("/sport-types")
def sport_types(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    items = db.scalars(
        select(SportType)
        .where(
            SportType.user_id.in_([user["uid"], SYSTEM_CATALOG_UID]),
            SportType.is_active.is_(True),
        )
        .order_by(SportType.user_id, SportType.name)
    ).all()

    return [
        {
            **row(item),
            "is_system": item.user_id == SYSTEM_CATALOG_UID,
        }
        for item in items
    ]


@router.post("/sport-types", status_code=201)
def add_sport_type(
    data: SportTypeIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(SportType).where(
            SportType.user_id.in_([user["uid"], SYSTEM_CATALOG_UID]),
            func.lower(SportType.name) == data.name.lower(),
        )
    )
    if existing:
        raise HTTPException(status_code=409, detail="Sport type already exists")

    return save(
        db,
        SportType(user_id=user["uid"], name=data.name),
    )


@router.delete("/sport-types/{sport_id}", status_code=204)
def delete_sport_type(
    sport_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    sport = db.get(SportType, sport_id)
    if sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    if sport.user_id == SYSTEM_CATALOG_UID:
        raise HTTPException(
            status_code=403,
            detail="Standard sports cannot be deleted",
        )
    if sport.user_id != user["uid"] and user.get("admin") is not True:
        raise HTTPException(status_code=403, detail="Forbidden")

    sport.is_active = False
    db.commit()
