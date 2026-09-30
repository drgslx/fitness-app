import copy
from sqlalchemy import select
from test_articles import client
from test_tracking import tracker
from test_food_catalog import BODY, PRODUCT
from app.main import app
from app.core.security import current_user
from app.models.tracking import Food, FoodExclusion, FoodFavorite, FoodSearchCache
from app.services import food_catalog as catalog


def as_user(uid="alice", admin=False):
    app.dependency_overrides[current_user] = lambda: {"uid": uid, "admin": admin}


def public_food(tracker):
    return tracker.post('/api/v1/foods', json={**BODY, 'is_public': True}).json()


def test_direct_diary_add_date_meal_grams_and_snapshot(tracker):
    food = public_food(tracker)
    response = tracker.post('/api/v1/diary', json={'food_id': food['id'], 'grams': 175, 'meal': 'Cina', 'day': '2026-09-30'})
    assert response.status_code == 201
    saved = response.json()
    assert saved['grams'] == 175 and saved['day'] == '2026-09-30' and saved['meal'] == 'Cina'
    assert saved['snapshot']['calories'] * saved['grams'] / 100 == 350
    assert tracker.get('/api/v1/diary?day=2026-09-30').json()[0]['id'] == saved['id']
    assert tracker.get('/api/v1/diary?day=2026-09-29').json() == []


def test_favorites_persist_are_idempotent_and_isolated(tracker, client):
    food = public_food(tracker); path = f'/api/v1/foods/{food["id"]}/favorite'
    for _ in range(2): assert tracker.put(path).status_code == 204
    assert tracker.get('/api/v1/foods/favorites').json()['items'][0]['id'] == food['id']
    assert tracker.get(f'/api/v1/foods/{food["id"]}').json()['is_favorite'] is True
    _, session = client
    with session() as db: assert len(list(db.scalars(select(FoodFavorite)))) == 1
    as_user('bob')
    assert tracker.get('/api/v1/foods/favorites').json()['items'] == []
    assert tracker.get(f'/api/v1/foods/{food["id"]}').json()['is_favorite'] is False
    assert tracker.delete(path).status_code == 204
    as_user()
    assert len(tracker.get('/api/v1/foods/favorites').json()['items']) == 1
    assert tracker.delete(path).status_code == 204
    assert tracker.get('/api/v1/foods/favorites').json()['items'] == []


def test_private_food_not_visible_even_to_other_admin(tracker):
    food = tracker.post('/api/v1/foods', json=BODY).json()
    as_user('bob', True)
    assert tracker.get(f'/api/v1/foods/{food["id"]}').status_code == 404
    assert tracker.put(f'/api/v1/foods/{food["id"]}/favorite').status_code == 404
    assert tracker.post('/api/v1/food-catalog/archive', json={'ids': [food['id']]}).status_code == 403


def test_moderation_requires_backend_admin_and_validates_whole_batch(tracker):
    public = public_food(tracker)
    private = tracker.post('/api/v1/foods', json=BODY).json()
    assert tracker.delete(f'/api/v1/foods/{public["id"]}').status_code == 403
    assert tracker.post('/api/v1/food-catalog/archive', json={'ids': [public['id']]}).status_code == 403
    as_user(admin=True)
    assert tracker.post('/api/v1/food-catalog/archive', json={'ids': [public['id'], private['id']]}).status_code == 403
    assert tracker.get(f'/api/v1/foods/{public["id"]}').status_code == 200
    assert tracker.post('/api/v1/food-catalog/archive', json={'ids': [public['id'], public['id']]}).status_code == 204
    assert tracker.get(f'/api/v1/foods/{public["id"]}').status_code == 404


def test_off_excluded_from_cache_lookup_refresh_and_seed_preserves_history(tracker, client, monkeypatch):
    monkeypatch.setattr(catalog, 'remote_products', lambda q: [copy.deepcopy(PRODUCT)])
    food = tracker.get('/api/v1/foods/search?q=branza').json()['items'][0]
    tracker.put(f'/api/v1/foods/{food["id"]}/favorite')
    diary = tracker.post('/api/v1/diary', json={'food_id': food['id'], 'grams': 150, 'meal': 'Lunch', 'day': '2026-09-30'}).json()
    body = {'name': 'Saved', 'servings': 2, 'cooked_total_grams': 300, 'ingredients': [{'food_id': food['id'], 'grams': 150}]}
    recipe = tracker.post('/api/v1/recipes', json=body).json()
    as_user(admin=True)
    assert tracker.delete(f'/api/v1/foods/{food["id"]}').status_code == 204
    monkeypatch.setattr(catalog, 'remote_products', lambda q: (_ for _ in ()).throw(AssertionError('Must not call OFF')))
    assert tracker.get('/api/v1/foods/search?q=' + PRODUCT['code']).json()['items'] == []
    assert tracker.get('/api/v1/foods/search?q=branza').json()['items'] == []
    assert tracker.get('/api/v1/foods/favorites').json()['items'] == []
    assert tracker.get('/api/v1/food-catalog/export').json()['items'] == []
    _, session = client
    with session() as db:
        assert db.get(FoodExclusion, PRODUCT['code']) is not None
        assert db.get(Food, food['id']).archived
        assert catalog.import_product(db, PRODUCT) is None
        assert catalog.import_product(db, PRODUCT, refresh=True) is None
        gate = db.get(FoodSearchCache, 'rate'); gate.expires = 0; db.commit()
    monkeypatch.setattr(catalog, 'remote_products', lambda q: [PRODUCT])
    assert tracker.get('/api/v1/foods/search?q=marca').json()['items'] == []
    assert tracker.post('/api/v1/foods', json={**BODY, 'barcode': PRODUCT['code']}).status_code == 409
    assert tracker.get('/api/v1/diary?day=2026-09-30').json()[0]['snapshot'] == diary['snapshot']
    assert tracker.get('/api/v1/recipes').json()[0]['total_calories'] == recipe['total_calories'] == 300
    body['ingredients'][0]['grams'] = 200
    assert tracker.put(f'/api/v1/recipes/{recipe["id"]}', json=body).json()['total_calories'] == 400
    assert tracker.put(f'/api/v1/diary/{diary["id"]}', json={'food_id': food['id'], 'grams': 200, 'meal': 'Lunch', 'day': '2026-09-30'}).status_code == 200
    assert tracker.post('/api/v1/diary', json={'food_id': food['id'], 'grams': 100, 'meal': 'Lunch', 'day': '2026-09-30'}).status_code == 404


def test_favorites_paginated_and_no_external_requests(tracker, monkeypatch):
    monkeypatch.setattr(catalog, 'remote_products', lambda q: (_ for _ in ()).throw(AssertionError('External call')))
    for i in range(22):
        food = tracker.post('/api/v1/foods', json={**BODY, 'name': f'Mancare {i:02}'}).json()
        tracker.put(f'/api/v1/foods/{food["id"]}/favorite')
    first = tracker.get('/api/v1/foods/favorites').json()
    assert len(first['items']) == 20 and first['has_more']
    second = tracker.get('/api/v1/foods/favorites?page=2').json()
    assert len(second['items']) == 2 and not second['has_more']
    assert len(tracker.get('/api/v1/foods/favorites?q=mancare%2021').json()['items']) == 1
    assert tracker.get('/api/v1/food-catalog/local?q=notfound').json()['items'] == []


def test_product_details_missing_values_are_not_fabricated(tracker, monkeypatch):
    monkeypatch.setattr(catalog, 'remote_products', lambda q: [PRODUCT])
    food = tracker.get('/api/v1/foods/search?q=branza').json()['items'][0]
    details = tracker.get(f'/api/v1/foods/{food["id"]}').json()
    assert details['catalog_data']['ingredients_text'] is None
    assert details['catalog_data']['nova_group'] is None
    assert details['catalog_data']['nutriscore'] == 'B'
    assert details['catalog_data']['url'].endswith(PRODUCT['code'])
    assert details['catalog_data']['license'] == 'ODbL-1.0'


def test_excluded_code_cannot_be_seeded_by_cli(tmp_path):
    import gzip, json, os, subprocess, sys
    from pathlib import Path
    from sqlalchemy import create_engine
    from sqlalchemy.orm import Session
    from app.db.base import Base
    engine = create_engine('sqlite:///' + str(tmp_path / 'seed.db'))
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        db.add(FoodExclusion(barcode=PRODUCT['code'], created_by='admin'))
        db.commit()
    path = tmp_path / 'off.jsonl.gz'
    with gzip.open(path, 'wt') as stream: stream.write(json.dumps(PRODUCT) + '\n')
    for extra in ([], ['--refresh']):
        subprocess.run([sys.executable, '-m', 'app.scripts.import_off', str(path), *extra],
            env={**os.environ, 'DATABASE_URL': str(engine.url)}, cwd=Path(__file__).resolve().parents[1], check=True, capture_output=True)
    with Session(engine) as db: assert list(db.scalars(select(Food))) == []
    engine.dispose()


def test_exclusion_covers_racing_unarchived_import(tracker, client, monkeypatch):
    _, session = client
    with session() as db:
        food = Food(user_id='__openfoodfacts__', **catalog.product_values(PRODUCT))
        db.add(food); db.flush(); food_id = food.id
        db.add(FoodExclusion(barcode=PRODUCT['code'], created_by='admin')); db.commit()
    monkeypatch.setattr(catalog, 'remote_products', lambda q: [PRODUCT])
    assert tracker.get('/api/v1/foods/search?q=branza').json()['items'] == []
    assert tracker.get(f'/api/v1/foods/{food_id}').status_code == 404
    assert tracker.put(f'/api/v1/foods/{food_id}/favorite').status_code == 404
    assert tracker.get('/api/v1/food-catalog/export').json()['items'] == []


def test_food_experience_migration_preserves_existing_foods():
    import importlib.util
    from pathlib import Path
    from sqlalchemy import create_engine, inspect, text
    from alembic.migration import MigrationContext
    from alembic.operations import Operations
    path = Path(__file__).resolve().parents[1] / 'alembic/versions/0009_food_experience.py'
    spec = importlib.util.spec_from_file_location('food_migration', path)
    migration = importlib.util.module_from_spec(spec); spec.loader.exec_module(migration)
    engine = create_engine('sqlite://')
    with engine.begin() as conn:
        conn.execute(text('CREATE TABLE foods (id INTEGER PRIMARY KEY, name VARCHAR(180))'))
        conn.execute(text("INSERT INTO foods (id, name) VALUES (1, 'Existing')"))
        with Operations.context(MigrationContext.configure(conn)):
            migration.upgrade()
            assert conn.execute(text('SELECT name, archived FROM foods')).one() == ('Existing', 0)
            assert {'food_favorites', 'food_exclusions'}.issubset(inspect(conn).get_table_names())
            migration.downgrade()
            assert conn.execute(text('SELECT name FROM foods')).scalar_one() == 'Existing'
    engine.dispose()
