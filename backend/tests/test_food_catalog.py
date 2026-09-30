import copy
from pathlib import Path
import pytest
import httpx
from sqlalchemy import select
from test_articles import client
from test_tracking import tracker
from app.main import app
from app.core.security import current_user
from app.models.tracking import Food, FoodSearchCache
from app.services import food_catalog as catalog

PRODUCT = {"code":"5941234567890", "product_name_ro":"Brânză test", "brands":"Marca", "nutrition_data_per":"100g", "nutriments":{"energy-kcal_100g":200, "proteins_100g":12, "carbohydrates_100g":4, "fat_100g":15, "salt_100g":1}, "nutriscore_grade":"b", "countries_tags":["en:romania"]}
BODY = {"name":"Mancare test", "calories":200, "nutrients":{"protein":12,"carbohydrates":4,"fat":15,"salt":1}}

def test_normalize_missing_liquid_and_energy_units():
    p = copy.deepcopy(PRODUCT)
    assert catalog.product_values(p)["catalog_data"]["nutriscore"] == "B"
    assert catalog.normalize(" Brânză   dulce ") == "branza dulce"
    p["quantity"] = "500 ml"
    assert catalog.product_values(p) is None
    p.pop("quantity"); p["nutriments"].pop("salt_100g")
    assert catalog.product_values(p) is None
    p["nutriments"]["sodium_100g"] = .4
    p["nutriments"].pop("energy-kcal_100g"); p["nutriments"]["energy-kj_100g"] = 836.8
    assert catalog.product_values(p)["calories"] == pytest.approx(200)
    assert catalog.product_values(p)["nutrients"]["salt"] == 1

def test_empty_short_and_local_search_never_call_off(tracker, monkeypatch):
    monkeypatch.setattr(catalog, "remote_products", lambda q: (_ for _ in ()).throw(AssertionError("External call")))
    assert tracker.get("/api/v1/foods").json() == []
    assert tracker.get("/api/v1/foods/search?q=ab").status_code == 422
    tracker.post("/api/v1/foods", json=BODY)
    data = tracker.get("/api/v1/foods/search?q=mancare").json()
    assert len(data["items"]) == 1 and data["source"] == "local"

def test_import_once_then_local_barcode_and_recipe_grams(tracker, monkeypatch):
    calls=[]
    monkeypatch.setattr(catalog, "remote_products", lambda q: calls.append(q) or [copy.deepcopy(PRODUCT)])
    data = tracker.get("/api/v1/foods/search?q=branza").json()
    f = data["items"][0]
    assert f["source"] == "openfoodfacts" and f["barcode"] == PRODUCT["code"]
    assert tracker.get("/api/v1/foods/search?q="+PRODUCT["code"]).json()["source"] == "local"
    assert tracker.get("/api/v1/foods/search?q=branza").json()["source"] == "local"
    assert len(calls)==1
    recipe = tracker.post("/api/v1/recipes", json={"name":"Test", "servings":2,"cooked_total_grams":300, "ingredients":[{"food_id":f["id"],"grams":150}]}).json()
    assert recipe["total_calories"] == 300 and recipe["calories_per_serving"] == 150 and recipe["calories_per_100"] == 100
    assert tracker.put(f'/api/v1/foods/{f["id"]}', json=BODY).status_code in (403,409)

def test_negative_cache_shared_across_users(tracker, monkeypatch):
    calls=[]
    monkeypatch.setattr(catalog, "remote_products", lambda q: calls.append(q) or [])
    assert tracker.get("/api/v1/foods/search?q=missing").json()["items"] == []
    app.dependency_overrides[current_user] = lambda:{"uid":"bob"}
    assert tracker.get("/api/v1/foods/search?q=missing").json()["source"] == "cache"
    assert len(calls)==1

def test_private_public_and_export(tracker):
    private = tracker.post("/api/v1/foods",json=BODY).json()
    public = tracker.post("/api/v1/foods",json={**BODY,"is_public":True,"barcode":"5941234567890"}).json()
    app.dependency_overrides[current_user] = lambda:{"uid":"bob"}
    assert tracker.get(f'/api/v1/foods/{private["id"]}').status_code == 404
    result = tracker.get("/api/v1/foods/search?q=mancare").json()
    assert [f["id"] for f in result["items"]] == [public["id"]]
    assert tracker.post("/api/v1/diary",json={"food_id":private["id"],"day":"2026-09-29","grams":100,"meal":"Lunch"}).status_code==404
    assert tracker.post("/api/v1/recipes",json={"name":"Hidden", "servings":1,"cooked_total_grams":100,"ingredients":[{"food_id":private["id"],"grams":100}]}).status_code==422
    export = tracker.get("/api/v1/food-catalog/export").json()
    assert [f["id"] for f in export["items"]] == [public["id"]]
    assert "user_id" not in export["items"][0]

def test_pagination_cap(tracker):
    for i in range(23): tracker.post("/api/v1/foods",json={**BODY,"name":f"Mancare {i:02}"})
    first=tracker.get("/api/v1/foods/search?q=mancare").json()
    second=tracker.get("/api/v1/foods/search?q=mancare&page=2").json()
    assert len(first["items"]) == 20 and first["has_more"]
    assert len(second["items"]) == 3 and not second["has_more"]

def test_shared_rate_gate(tracker, monkeypatch):
    monkeypatch.setattr(catalog,"remote_products",lambda q: [])
    assert tracker.get("/api/v1/foods/search?q=first").status_code==200
    assert tracker.get("/api/v1/foods/search?q=second").status_code==429

def test_off_outage_not_cached_as_empty(tracker, client, monkeypatch):
    monkeypatch.setattr(catalog,"remote_products",lambda q: (_ for _ in ()).throw(httpx.ConnectError("offline")))
    assert tracker.get("/api/v1/foods/search?q=offline").status_code==503
    _, session=client
    with session() as db:
        assert len(list(db.scalars(select(FoodSearchCache).where(FoodSearchCache.key != "rate"))))==0

def test_import_idempotent_and_snapshot_unchanged(client):
    _, session=client
    with session() as db:
        first=catalog.import_product(db, PRODUCT); db.commit()
        second=catalog.import_product(db, PRODUCT); db.commit()
        assert first.id == second.id
        assert len(list(db.scalars(select(Food)))) == 1

def test_http_contract(monkeypatch):
    monkeypatch.setattr(catalog.settings,"off_user_agent","Athletica/1.0 (test@example.test)")
    real_client=httpx.Client
    seen=[]
    def handle(request):
        seen.append(request)
        assert request.headers["User-Agent"].startswith("Athletica/")
        return httpx.Response(200,json={"product":PRODUCT} if "/product/" in request.url.path else {"products":[PRODUCT]})
    monkeypatch.setattr(catalog.httpx,"Client",lambda **kw: real_client(transport=httpx.MockTransport(handle),**kw))
    assert catalog.remote_products(PRODUCT["code"])[0]["code"] == PRODUCT["code"]
    assert catalog.remote_products("branza")[0]["code"] == PRODUCT["code"]
    assert seen[1].url.params["tag_0"] == "romania"
    assert seen[1].url.params["page_size"] == "20"

def test_existing_recipe_can_edit_grams_after_food_becomes_private(tracker):
    public = tracker.post('/api/v1/foods', json={**BODY,'is_public':True}).json()
    app.dependency_overrides[current_user] = lambda:{'uid':'bob'}
    body={'name':'Saved','servings':1,'cooked_total_grams':100,'ingredients':[{'food_id':public['id'],'grams':100}]}
    recipe=tracker.post('/api/v1/recipes',json=body).json()
    app.dependency_overrides[current_user] = lambda:{'uid':'alice'}
    assert tracker.put(f'/api/v1/foods/{public["id"]}',json=BODY).status_code==200
    app.dependency_overrides[current_user] = lambda:{'uid':'bob'}
    body['ingredients'][0]['grams']=150
    response=tracker.put(f'/api/v1/recipes/{recipe["id"]}',json=body)
    assert response.status_code==200, response.text
    assert response.json()['total_calories']==300

def test_offline_seed_is_streamed_filtered_and_repeatable(tmp_path):
    import gzip, json, os, subprocess, sys
    from sqlalchemy import create_engine
    from app.db.base import Base
    path=tmp_path/'products.jsonl.gz'
    foreign={**PRODUCT,'code':'1234567890123','countries_tags':['en:france']}
    with gzip.open(path,'wt') as stream:
        for product in [PRODUCT,foreign,PRODUCT]: stream.write(json.dumps(product)+'\n')
    url='sqlite:///'+str(tmp_path/'seed.db')
    engine=create_engine(url); Base.metadata.create_all(engine)
    env={**os.environ,'DATABASE_URL':url}
    for _ in range(2):
        subprocess.run([sys.executable,'-m','app.scripts.import_off',str(path)],env=env,check=True,capture_output=True,cwd=Path(__file__).resolve().parents[1])
    with engine.connect() as conn:
        assert len(conn.execute(select(Food)).all())==1
    engine.dispose()


def test_barcode_lookup_discards_product_without_romania_tag(monkeypatch):
    monkeypatch.setattr(catalog.settings,"off_user_agent","Athletica/1.0 (test@example.test)")
    real_client=httpx.Client
    foreign={**PRODUCT,"countries_tags":["en:united-states"]}
    def handle(request):
        return httpx.Response(200,json={"product":foreign})
    monkeypatch.setattr(catalog.httpx,"Client",lambda **kw: real_client(transport=httpx.MockTransport(handle),**kw))
    assert catalog.remote_products(PRODUCT["code"]) == []
