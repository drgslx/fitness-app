from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user, require_admin
from app.db.session import get_db
from app.models.tracking import Food, Nutrient
from app.schemas.tracking import FoodIn


router = APIRouter(tags=["nutrition-foods"])


def validate_food(data: FoodIn, db: Session):
    keys = set(db.scalars(select(Nutrient.key)))
    if set(data.nutrients) - keys:
        raise HTTPException(status_code=422, detail="Unknown nutrient")
    required = {"carbohydrates", "protein", "fat", "salt"}
    if not required.issubset(data.nutrients):
        raise HTTPException(
            status_code=422,
            detail="Carbohydrates, protein, fat and salt are required per 100 g",
        )


@router.get("/foods")
def foods(
    q: str = Query(default="", max_length=180),
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    query = select(Food).order_by(Food.name).limit(200)
    if q.strip():
        query = query.where(Food.name.ilike(f"%{q.strip()}%"))
    return [row(item) for item in db.scalars(query)]


@router.post("/foods", status_code=201)
def add_food(
    data: FoodIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_food(data, db)
    return save(
        db,
        Food(user_id=user["uid"], **data.model_dump()),
    )


@router.put("/foods/{item_id}")
def edit_food(
    item_id: int,
    data: FoodIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    food = db.get(Food, item_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    if food.user_id != user["uid"] and user.get("admin") is not True:
        raise HTTPException(
            status_code=403,
            detail="Only the author or an admin can edit a food",
        )

    validate_food(data, db)
    for key, value in data.model_dump().items():
        setattr(food, key, value)
    return save(db, food)


@router.delete(
    "/foods/{item_id}",
    status_code=204,
    dependencies=[Depends(require_admin)],
)
def delete_food(
    item_id: int,
    db: Session = Depends(get_db),
):
    food = db.get(Food, item_id)
    if food is None:
        raise HTTPException(status_code=404, detail="Food not found")
    db.delete(food)
    db.commit()
