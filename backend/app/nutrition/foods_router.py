from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from app.services.food_catalog import local_search, normalize, search, visible
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
    return [row(item) for item in local_search(db, user, q)]


@router.get("/foods/search")
def search_foods(q: str = Query(min_length=3, max_length=180), page: int = Query(default=1, ge=1, le=1000), user=Depends(current_user), db: Session = Depends(get_db)):
    items, more, source, message = search(db, user, q, page)
    return {"items": [row(item) for item in items], "has_more": more, "source": source, "message": message, "page": page}


@router.get("/foods/{item_id}")
def get_food(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    food = db.get(Food, item_id)
    if not visible(food, user): raise HTTPException(404, "Food not found")
    return row(food)



@router.post("/foods", status_code=201)
def add_food(
    data: FoodIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_food(data, db)
    return save(
        db,
        Food(user_id=user["uid"], search_text=normalize(data.name), **data.model_dump()),
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

    if food.source == "openfoodfacts":
        raise HTTPException(409, "Produs importat: corecteaza sursa OFF sau creeaza un aliment personal.")
    food.source = "manual"
    food.search_text = normalize(data.name)
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


@router.get("/food-catalog/export")
def export_catalog(after: int = Query(default=0, ge=0), db: Session = Depends(get_db)):
    foods = list(db.scalars(select(Food).where(Food.id > after, Food.is_public.is_(True), Food.source.in_(["openfoodfacts", "manual"])).order_by(Food.id).limit(501)))
    items = [{"id": f.id, "name": f.name, "barcode": f.barcode, "calories": f.calories, "nutrients": f.nutrients, "source": f.source, "metadata": f.catalog_data} for f in foods[:500]]
    return {"license": "https://opendatacommons.org/licenses/odbl/1-0/", "attribution": "Open Food Facts and ATHLETICA contributors", "items": items, "next_after": items[-1]["id"] if len(foods)>500 else None}
