from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.security import current_user
from app.db.session import get_db
from app.models.recipe import Recipe, RecipeIngredient, RecipeDiaryEntry
from app.models.tracking import Food
from app.schemas.recipe import RecipeIn, RecipeDiaryIn

router = APIRouter(tags=["recipes"])


def row(item):
    return {column.name: getattr(item, column.name) for column in item.__table__.columns}


def own_recipe(db, recipe_id, user):
    recipe = db.scalar(select(Recipe).where(Recipe.id == recipe_id, Recipe.user_id == user["uid"]))
    if recipe is None:
        raise HTTPException(404, "Recipe not found")
    return recipe


def summary(recipe, ingredients):
    raw_total = sum(item.grams for item in ingredients)
    total_calories = sum(item.snapshot["calories"] * item.grams / 100 for item in ingredients)
    totals = {}
    for item in ingredients:
        for key, value in item.snapshot["nutrients"].items():
            totals[key] = totals.get(key, 0) + value * item.grams / 100
    basis_grams = recipe.cooked_total_grams or raw_total
    per_100 = {key: round(value * 100 / basis_grams, 3) for key, value in totals.items()}
    return {
        "raw_total_grams": round(raw_total, 2),
        "cooked_total_grams": recipe.cooked_total_grams,
        "total_calories": round(total_calories, 2),
        "total_nutrients": {key: round(value, 3) for key, value in totals.items()},
        "calories_per_100": round(total_calories * 100 / basis_grams, 3),
        "nutrients_per_100": per_100,
        "calories_per_serving": round(total_calories / recipe.servings, 2),
        "basis_grams": round(basis_grams, 2),
    }


def recipe_out(recipe, db):
    ingredients = db.scalars(select(RecipeIngredient).where(RecipeIngredient.recipe_id == recipe.id).order_by(RecipeIngredient.id)).all()
    return {**row(recipe), "ingredients": [row(item) for item in ingredients], **summary(recipe, ingredients)}


def ingredient_rows(data, db):
    rows = []
    for item in data.ingredients:
        food = db.get(Food, item.food_id)
        if food is None:
            raise HTTPException(422, f"Food {item.food_id} does not exist")
        rows.append(RecipeIngredient(food_id=food.id, name=food.name, grams=item.grams, snapshot={"calories": food.calories, "nutrients": food.nutrients}))
    return rows


@router.get("/recipes")
def recipes(q: str = Query(default="", max_length=180), user=Depends(current_user), db: Session = Depends(get_db)):
    query = select(Recipe).where(Recipe.user_id == user["uid"]).order_by(Recipe.name).limit(100)
    if q.strip():
        query = query.where(Recipe.name.ilike("%" + q.strip() + "%"))
    return [recipe_out(item, db) for item in db.scalars(query)]


@router.get("/recipes/{recipe_id}")
def recipe(recipe_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    return recipe_out(own_recipe(db, recipe_id, user), db)


@router.post("/recipes", status_code=201)
def add_recipe(data: RecipeIn, user=Depends(current_user), db: Session = Depends(get_db)):
    recipe = Recipe(user_id=user["uid"], name=data.name, servings=data.servings, cooked_total_grams=data.cooked_total_grams, notes=data.notes)
    db.add(recipe)
    db.flush()
    for ingredient in ingredient_rows(data, db):
        ingredient.recipe_id = recipe.id
        db.add(ingredient)
    db.commit()
    db.refresh(recipe)
    return recipe_out(recipe, db)


@router.put("/recipes/{recipe_id}")
def edit_recipe(recipe_id: int, data: RecipeIn, user=Depends(current_user), db: Session = Depends(get_db)):
    recipe = own_recipe(db, recipe_id, user)
    recipe.name = data.name
    recipe.servings = data.servings
    recipe.cooked_total_grams = data.cooked_total_grams
    recipe.notes = data.notes
    db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe.id).delete()
    for ingredient in ingredient_rows(data, db):
        ingredient.recipe_id = recipe.id
        db.add(ingredient)
    db.commit()
    return recipe_out(recipe, db)


@router.delete("/recipes/{recipe_id}", status_code=204)
def remove_recipe(recipe_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    recipe = own_recipe(db, recipe_id, user)
    db.query(RecipeIngredient).filter(RecipeIngredient.recipe_id == recipe.id).delete()
    db.delete(recipe)
    db.commit()


def recipe_diary_values(data, user, db):
    recipe = own_recipe(db, data.recipe_id, user)
    details = recipe_out(recipe, db)
    grams = data.amount if data.unit == "grams" else details["basis_grams"] * data.amount / recipe.servings
    snapshot = {
        "name": recipe.name,
        "calories": details["calories_per_100"],
        "nutrients": details["nutrients_per_100"],
        "source": "recipe",
    }
    return {"recipe_id": recipe.id, "day": data.day, "meal": data.meal, "grams": grams, "servings": data.amount if data.unit == "servings" else None, "quantity_unit": data.unit, "snapshot": snapshot}


@router.post("/recipe-diary", status_code=201)
def add_recipe_diary(data: RecipeDiaryIn, user=Depends(current_user), db: Session = Depends(get_db)):
    item = RecipeDiaryEntry(user_id=user["uid"], **recipe_diary_values(data, user, db))
    db.add(item)
    db.commit()
    db.refresh(item)
    return {**row(item), "entry_type": "recipe"}


@router.put("/recipe-diary/{entry_id}")
def edit_recipe_diary(entry_id: int, data: RecipeDiaryIn, user=Depends(current_user), db: Session = Depends(get_db)):
    item = db.scalar(select(RecipeDiaryEntry).where(RecipeDiaryEntry.id == entry_id, RecipeDiaryEntry.user_id == user["uid"]))
    if item is None:
        raise HTTPException(404, "Not found")
    for key, value in recipe_diary_values(data, user, db).items():
        setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return {**row(item), "entry_type": "recipe"}


@router.delete("/recipe-diary/{entry_id}", status_code=204)
def remove_recipe_diary(entry_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    item = db.scalar(select(RecipeDiaryEntry).where(RecipeDiaryEntry.id == entry_id, RecipeDiaryEntry.user_id == user["uid"]))
    if item is None:
        raise HTTPException(404, "Not found")
    db.delete(item)
    db.commit()
