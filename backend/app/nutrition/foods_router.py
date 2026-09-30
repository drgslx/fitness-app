from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select, or_
from sqlalchemy.exc import IntegrityError
from pydantic import BaseModel, Field
from app.services.food_catalog import active_food_clause, local_search, normalize, search, visible
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user, require_admin
from app.db.session import get_db
from app.models.tracking import Food, Nutrient, FoodFavorite, FoodExclusion
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
    return food_rows(db, user, local_search(db, user, q))


@router.get("/foods/search")
def search_foods(q: str = Query(min_length=3, max_length=180), page: int = Query(default=1, ge=1, le=1000), user=Depends(current_user), db: Session = Depends(get_db)):
    items, more, source, message = search(db, user, q, page)
    return {"items": food_rows(db, user, items), "has_more": more, "source": source, "message": message, "page": page}


def food_rows(db, user, items):
    ids = [item.id for item in items]
    favorites = set(db.scalars(select(FoodFavorite.food_id).where(
        FoodFavorite.user_id == user["uid"], FoodFavorite.food_id.in_(ids)))) if ids else set()
    return [{**row(item), "is_favorite": item.id in favorites} for item in items]


def validate_barcode(data, db):
    if data.barcode and db.get(FoodExclusion, data.barcode):
        raise HTTPException(409, "Cod exclus de administrator din catalog.")


@router.get("/foods/favorites")
def favorites(q: str = Query(default="", max_length=180), page: int = Query(default=1, ge=1, le=1000),
              user=Depends(current_user), db: Session = Depends(get_db)):
    query = select(Food).join(FoodFavorite).where(
        FoodFavorite.user_id == user["uid"], active_food_clause(),
        or_(Food.is_public.is_(True), Food.user_id == user["uid"]))
    term = normalize(q)
    if term:
        query = query.where(Food.barcode == term if term.isdigit() else Food.search_text.contains(term, autoescape=True))
    items = list(db.scalars(query.order_by(Food.name, Food.id).offset((page-1)*20).limit(21)))
    return {"items": food_rows(db, user, items[:20]), "page": page, "has_more": len(items)>20, "source": "favorites", "message": ""}


@router.put("/foods/{item_id}/favorite", status_code=204)
def add_favorite(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    if not visible(db.get(Food, item_id), user): raise HTTPException(404, "Food not found")
    if db.get(FoodFavorite, (user["uid"], item_id)) is None:
        try:
            with db.begin_nested():
                db.add(FoodFavorite(user_id=user["uid"], food_id=item_id))
                db.flush()
        except IntegrityError:
            pass  # Concurrent identical requests are idempotent.
    db.commit()


@router.delete("/foods/{item_id}/favorite", status_code=204)
def remove_favorite(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    favorite = db.get(FoodFavorite, (user["uid"], item_id))
    if favorite: db.delete(favorite)
    db.commit()


class ArchiveSelection(BaseModel):
    ids: list[int] = Field(min_length=1, max_length=100)


def archive_foods(db, ids, user):
    foods = list(db.scalars(select(Food).where(Food.id.in_(set(ids))).order_by(Food.id)))
    if len(foods) != len(set(ids)): raise HTTPException(404, "Food not found")
    if any(not food.is_public for food in foods):
        raise HTTPException(403, "Administrarea catalogului comun accepta numai produse publice.")
    codes = {f.off_code or f.barcode for f in foods} - {None, ""}
    for code in sorted(codes):
        if db.get(FoodExclusion, code) is None:
            try:
                with db.begin_nested():
                    db.add(FoodExclusion(barcode=code, created_by=user["uid"]))
                    db.flush()
            except IntegrityError:
                pass
    # Hide public duplicates of the same code as well. Historical rows stay intact.
    duplicates = list(db.scalars(select(Food).where(Food.is_public.is_(True),
        or_(Food.barcode.in_(codes), Food.off_code.in_(codes))))) if codes else []
    for food in foods + duplicates: food.archived = True
    db.commit()


@router.post("/food-catalog/archive", status_code=204)
def archive_selection(data: ArchiveSelection, user=Depends(require_admin), db: Session = Depends(get_db)):
    archive_foods(db, data.ids, user)


@router.get("/food-catalog/local")
def local_page(q: str = Query(default="", max_length=180), page: int = Query(default=1, ge=1, le=1000),
               user=Depends(current_user), db: Session = Depends(get_db)):
    items = local_search(db, user, q, (page-1)*20, 21)
    return {"items": food_rows(db, user, items[:20]), "page": page, "has_more": len(items)>20, "source": "local", "message": ""}


@router.get("/foods/{item_id}")
def get_food(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    food = db.get(Food, item_id)
    if not visible(food, user): raise HTTPException(404, "Food not found")
    return food_rows(db, user, [food])[0]



@router.post("/foods", status_code=201)
def add_food(
    data: FoodIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_food(data, db)
    validate_barcode(data, db)
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
    if food is None or food.archived:
        raise HTTPException(status_code=404, detail="Food not found")
    if food.user_id != user["uid"] and (not food.is_public or user.get("admin") is not True):
        raise HTTPException(
            status_code=403,
            detail="Only the author or an admin can edit a food",
        )

    if food.source == "openfoodfacts":
        raise HTTPException(409, "Produs importat: corecteaza sursa OFF sau creeaza un aliment personal.")
    food.source = "manual"
    food.search_text = normalize(data.name)
    validate_food(data, db)
    validate_barcode(data, db)
    for key, value in data.model_dump().items():
        setattr(food, key, value)
    return save(db, food)


@router.delete("/foods/{item_id}", status_code=204)
def delete_food(item_id: int, user=Depends(require_admin), db: Session = Depends(get_db)):
    archive_foods(db, [item_id], user)


@router.get("/food-catalog/export")
def export_catalog(after: int = Query(default=0, ge=0), db: Session = Depends(get_db)):
    foods = list(db.scalars(select(Food).where(Food.id > after, active_food_clause(), Food.is_public.is_(True), Food.source.in_(["openfoodfacts", "manual"])).order_by(Food.id).limit(501)))
    items = [{"id": f.id, "name": f.name, "barcode": f.barcode, "calories": f.calories, "nutrients": f.nutrients, "source": f.source, "metadata": f.catalog_data} for f in foods[:500]]
    return {"license": "https://opendatacommons.org/licenses/odbl/1-0/", "attribution": "Open Food Facts and ATHLETICA contributors", "items": items, "next_after": items[-1]["id"] if len(foods)>500 else None}
