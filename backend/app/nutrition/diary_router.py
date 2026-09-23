from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import owned, row, save
from app.core.security import current_user
from app.db.session import get_db
from app.models.recipe import RecipeDiaryEntry
from app.models.tracking import DiaryEntry, Food
from app.schemas.tracking import EntryIn


router = APIRouter(tags=["nutrition-diary"])


def entry_values(data: EntryIn, db: Session):
    food = db.get(Food, data.food_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    return {
        **data.model_dump(),
        "snapshot": {
            "name": food.name,
            "calories": food.calories,
            "nutrients": food.nutrients,
        },
    }


@router.get("/diary")
def diary(
    day: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    food_entries = [
        {**row(item), "entry_type": "food", "source_id": item.id}
        for item in db.scalars(
            select(DiaryEntry)
            .where(
                DiaryEntry.user_id == user["uid"],
                DiaryEntry.day == day,
            )
            .order_by(DiaryEntry.id)
        )
    ]
    recipe_entries = [
        {**row(item), "entry_type": "recipe", "source_id": item.id}
        for item in db.scalars(
            select(RecipeDiaryEntry)
            .where(
                RecipeDiaryEntry.user_id == user["uid"],
                RecipeDiaryEntry.day == day,
            )
            .order_by(RecipeDiaryEntry.id)
        )
    ]
    return sorted(
        food_entries + recipe_entries,
        key=lambda item: (item["meal"], item["id"]),
    )


@router.post("/diary", status_code=201)
def add_entry(
    data: EntryIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    return save(
        db,
        DiaryEntry(
            user_id=user["uid"],
            **entry_values(data, db),
        ),
    )


@router.put("/diary/{item_id}")
def edit_entry(
    item_id: int,
    data: EntryIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    entry = owned(db, DiaryEntry, item_id, user)
    values = data.model_dump()
    if entry.food_id != data.food_id:
        values = entry_values(data, db)
    for key, value in values.items():
        setattr(entry, key, value)
    return save(db, entry)


@router.delete("/diary/{item_id}", status_code=204)
def remove_entry(
    item_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    db.delete(owned(db, DiaryEntry, item_id, user))
    db.commit()
