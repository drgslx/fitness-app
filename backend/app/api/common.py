from datetime import date

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session


def row(item):
    return {
        column.name: getattr(item, column.name)
        for column in item.__table__.columns
    }


def owned(db: Session, model, item_id: int, user: dict):
    item = db.scalar(
        select(model).where(
            model.id == item_id,
            model.user_id == user["uid"],
        )
    )
    if item is None:
        raise HTTPException(status_code=404, detail="Not found")
    return item


def validate_date_range(start: date, end: date):
    if end < start or (end - start).days > 366:
        raise HTTPException(
            status_code=422,
            detail="Choose an ordered range of at most 367 days",
        )


def save(db: Session, item):
    db.add(item)
    db.commit()
    db.refresh(item)
    return row(item)
