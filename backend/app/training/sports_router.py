from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user
from app.db.session import get_db
from app.models.tracking import SportType
from app.schemas.tracking import SportTypeIn, SportDefaultsIn
from app.services.activity_catalog import CATALOG
from app.services.energy import refresh_energy_goal
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
    if data.activity_type is not None and data.activity_type not in CATALOG:
        raise HTTPException(422, "Tip energetic necunoscut.")
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
        SportType(user_id=user["uid"], **data.model_dump()),
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
    refresh_energy_goal(db, sport.user_id)
    db.commit()


@router.put("/sport-types/{sport_id}/defaults")
def set_defaults(sport_id: int, data: SportDefaultsIn, user=Depends(current_user), db: Session = Depends(get_db)):
    sport = db.scalar(select(SportType).where(SportType.id == sport_id, SportType.user_id == user["uid"], SportType.is_active.is_(True)))
    if sport is None: raise HTTPException(404, "Sportul personal nu este disponibil.")
    if data.activity_type is not None and data.activity_type not in CATALOG: raise HTTPException(422, "Tip energetic necunoscut.")
    for key, value in data.model_dump().items(): setattr(sport, key, value)
    return save(db, sport)
