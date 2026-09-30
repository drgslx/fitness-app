"""Local-first search. No external calls on empty search or page load."""
import hashlib
import math
import re
import time
import unicodedata
import httpx
from fastapi import HTTPException
from sqlalchemy import select, or_, update
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import object_session
from app.models.tracking import Food, FoodSearchCache, FoodExclusion
from app.core.config import settings

FIELDS = "code,product_name,product_name_ro,brands,categories,categories_tags,countries_tags,nutriments,nutrition_data_per,product_quantity_unit,serving_size,quantity,nutriscore_grade,nutrition_grades,nova_group,ingredients_text,allergens_tags,last_modified_t"

def normalize(text):
    return " ".join("".join(c for c in unicodedata.normalize("NFKD", text.lower()) if not unicodedata.combining(c)).split())

def active_food_clause():
    # Also excludes an import that raced an admin transaction before seeing the block.
    excluded = select(FoodExclusion.barcode).where(or_(
        FoodExclusion.barcode == Food.barcode, FoodExclusion.barcode == Food.off_code)).exists()
    return Food.archived.is_(False) & (~Food.is_public | ~excluded)


def visible(food, user):
    if food is None or food.archived or not (food.is_public or food.user_id == user["uid"]):
        return False
    db = object_session(food)
    if food.is_public and db and any(db.get(FoodExclusion, code) for code in {food.barcode, food.off_code} if code):
        return False
    return True

def local_search(db, user, q, offset=0, limit=20):
    q = normalize(q)
    if len(q) < 3: return []
    clause = Food.barcode == q if q.isdigit() else Food.search_text.contains(q, autoescape=True)
    return list(db.scalars(select(Food).where(active_food_clause(), or_(Food.is_public.is_(True), Food.user_id == user["uid"]), clause).order_by(Food.name, Food.id).offset(offset).limit(limit)))

def product_values(product):
    if not isinstance(product, dict): return None
    code = str(product.get("code", ""))
    name = product.get("product_name_ro") or product.get("product_name")
    if not re.fullmatch(r"[0-9]{8,14}", code) or not isinstance(name, str) or not name.strip(): return None
    # Existing recipes use grams, not millilitres: never silently assume density=1.
    basis = " ".join(str(product.get(k, "")) for k in ("nutrition_data_per", "product_quantity_unit", "quantity", "serving_size")).lower()
    if re.search(r"ml|cl|litre|liter|\b[0-9.,]+\s*l\b", basis) or "en:beverages" in (product.get("categories_tags") or []): return None
    n = product.get("nutriments") or {}
    if not isinstance(n, dict): return None
    def number(key):
        v = n.get(key)
        if isinstance(v, bool): return None
        try: v = float(v)
        except (TypeError, ValueError): return None
        return v if math.isfinite(v) and 0 <= v <= 100000 else None
    calories = number("energy-kcal_100g")
    if calories is None and number("energy-kj_100g") is not None: calories = number("energy-kj_100g") / 4.184
    nutrients = {k: number(off + "_100g") for k, off in {"carbohydrates":"carbohydrates", "protein":"proteins", "fat":"fat", "salt":"salt"}.items()}
    if nutrients["salt"] is None and number("sodium_100g") is not None: nutrients["salt"] = number("sodium_100g") * 2.5
    if calories is None or any(v is None for v in nutrients.values()): return None
    grade = product.get("nutriscore_grade") or product.get("nutrition_grades")
    metadata = {k: product.get(k) for k in ("brands", "categories", "quantity", "serving_size", "nova_group", "ingredients_text", "allergens_tags", "last_modified_t")}
    metadata.update(nutriscore=grade.upper() if grade in list("abcde") else None, url="https://world.openfoodfacts.org/product/" + code, license="ODbL-1.0", basis="100 g")
    return dict(name=name.strip()[:180], barcode=code, off_code=code, calories=calories, nutrients=nutrients, is_public=True, source="openfoodfacts", catalog_data=metadata, search_text=normalize(name + " " + str(product.get("brands", "")))[:1000])

def import_product(db, product, refresh=False):
    values = product_values(product)
    if values is None or db.get(FoodExclusion, values["off_code"]) is not None: return None
    existing = db.scalar(select(Food).where(Food.off_code == values["off_code"]))
    if existing:
        if existing.archived: return None
        if refresh:
            for key, value in values.items(): setattr(existing, key, value)
        return existing
    try:
        with db.begin_nested():
            food = Food(user_id="__openfoodfacts__", **values)
            db.add(food); db.flush()
        return food
    except IntegrityError:
        return db.scalar(select(Food).where(Food.off_code == values["off_code"], Food.archived.is_(False)))

def remote_products(q):
    if not settings.off_user_agent: raise HTTPException(503, "Cautarea externa nu este configurata. Poti adauga alimentul manual.")
    with httpx.Client(timeout=12, headers={"User-Agent": settings.off_user_agent}, follow_redirects=False) as client:
        if q.isdigit():
            response = client.get("https://world.openfoodfacts.org/api/v3/product/" + q, params={"fields": FIELDS})
            if response.status_code == 404: return []
            response.raise_for_status()
            data = response.json()
            product = data.get("product")
            country = settings.off_country_tag.strip()
            if not country: return [product] if isinstance(product, dict) else []
            countries = product.get("countries_tags", []) if isinstance(product, dict) else []
            return [product] if isinstance(countries, list) and country in countries else []
        params = {"search_terms":q, "search_simple":1, "action":"process", "json":1, "page_size":20, "fields":FIELDS}
        country = settings.off_country_tag.strip()
        if country:
            params.update(tagtype_0="countries", tag_contains_0="contains", tag_0=country.removeprefix("en:"))
        response = client.get("https://world.openfoodfacts.org/cgi/search.pl", params=params)
        response.raise_for_status()
        return response.json().get("products", [])

def search(db, user, q, page=1):
    q = normalize(q)
    if q.isdigit() and not re.fullmatch(r"[0-9]{8,14}", q):
        raise HTTPException(422, "Codul de bare trebuie sa aiba 8–14 cifre.")
    if q.isdigit() and db.get(FoodExclusion, q):
        return [], False, "local", "Acest produs a fost exclus din catalog de administrator."
    found = local_search(db, user, q, (page-1)*20, 21)
    if found or page > 1 or len(q) < 3:
        return found[:20], len(found)>20, "local", ""
    key = hashlib.sha256(((settings.off_country_tag.strip() or "global") + ":" + q).encode()).hexdigest()
    now = time.time()
    cache = db.get(FoodSearchCache, key)
    if cache and cache.expires > now:
        ids = cache.payload.get("ids", [])
        return list(db.scalars(select(Food).where(Food.id.in_(ids), Food.is_public.is_(True), active_food_clause()))), False, "cache", cache.payload.get("message", "")
    # One shared gate across workers; seven seconds stays below both OFF limits.
    if db.get(FoodSearchCache, "rate") is None:
        try:
            with db.begin_nested(): db.add(FoodSearchCache(key="rate", expires=0, payload={})); db.flush()
        except IntegrityError: pass
    allowed = db.execute(update(FoodSearchCache).where(FoodSearchCache.key == "rate", FoodSearchCache.expires <= now).values(expires=now+7)).rowcount
    db.commit()
    if not allowed: raise HTTPException(429, "Cautarea externa este ocupata. Reincearca in cateva secunde.", headers={"Retry-After":"7"})
    try: products = remote_products(q)
    except (httpx.HTTPError, ValueError): raise HTTPException(503, "Open Food Facts nu raspunde. Reincearca sau adauga manual.")
    items = []
    for product in products[:20]:
        food = import_product(db, product)
        if food and food.id not in [f.id for f in items]: items.append(food)
    message = "" if items else "Niciun produs utilizabil per 100 g. Adauga manual; valorile lipsa nu sunt inlocuite cu zero."
    db.merge(FoodSearchCache(key=key, expires=now+(86400 if items else 21600), payload={"ids":[f.id for f in items], "message":message}))
    db.commit()
    items = [food for food in items if visible(food, user)]
    return items, False, "openfoodfacts", message
