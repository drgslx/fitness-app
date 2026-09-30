"""Export licensed catalog data only, without accounts, diaries or recipes."""
import json
from sqlalchemy import select
from app.db.session import SessionLocal
from app.models.tracking import Food
from app.services.food_catalog import active_food_clause

def main():
    with SessionLocal() as db:
        foods = db.scalars(select(Food).where(Food.is_public.is_(True), active_food_clause(), Food.source.in_(["openfoodfacts", "manual"])).execution_options(yield_per=500))
        for food in foods:
            print(json.dumps({"name":food.name, "barcode":food.barcode, "calories":food.calories, "nutrients":food.nutrients, "source":food.source, "metadata":food.catalog_data}, ensure_ascii=False))
if __name__ == "__main__": main()
