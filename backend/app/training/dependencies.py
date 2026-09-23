from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.tracking import SportType


SYSTEM_CATALOG_UID = "__system__"


def readable_sport(db: Session, sport_id: int, user: dict):
    sport = db.scalar(
        select(SportType).where(
            SportType.id == sport_id,
            SportType.user_id.in_([user["uid"], SYSTEM_CATALOG_UID]),
            SportType.is_active.is_(True),
        )
    )
    if sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    return sport
