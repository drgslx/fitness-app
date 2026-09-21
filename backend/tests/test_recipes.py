from test_tracking import tracker, food


def test_recipe_totals_cooked_weight_and_diary_snapshot(tracker):
    chicken = food(tracker)
    rice = tracker.post(
        "/api/v1/foods",
        json={"name": "Rice", "calories": 360, "nutrients": {"carbohydrates": 80, "protein": 7, "fat": 1, "salt": 0.02}},
    ).json()
    body = {
        "name": "Chicken rice",
        "servings": 4,
        "cooked_total_grams": 1000,
        "ingredients": [{"food_id": chicken["id"], "grams": 500}, {"food_id": rice["id"], "grams": 200}],
    }
    created = tracker.post("/api/v1/recipes", json=body)
    assert created.status_code == 201, created.text
    recipe = created.json()
    assert recipe["raw_total_grams"] == 700
    assert recipe["cooked_total_grams"] == 1000
    assert recipe["total_calories"] == 1720
    assert recipe["calories_per_100"] == 172

    entry = tracker.post("/api/v1/recipe-diary", json={"recipe_id": recipe["id"], "day": "2026-09-21", "meal": "Lunch", "amount": 250, "unit": "grams"})
    assert entry.status_code == 201, entry.text
    assert entry.json()["grams"] == 250
    report = tracker.get("/api/v1/nutrition-report?start=2026-09-21&end=2026-09-21").json()
    assert report["days"][0]["calories"] == 430

    body["name"] = "Changed recipe"
    body["ingredients"][0]["grams"] = 100
    assert tracker.put(f"/api/v1/recipes/{recipe['id']}", json=body).status_code == 200
    report = tracker.get("/api/v1/nutrition-report?start=2026-09-21&end=2026-09-21").json()
    assert report["days"][0]["calories"] == 430


def test_recipe_is_personal(tracker):
    item = food(tracker)
    recipe = tracker.post("/api/v1/recipes", json={"name": "Personal", "servings": 1, "ingredients": [{"food_id": item["id"], "grams": 100}]}).json()
    from app.main import app
    from app.core.security import current_user
    app.dependency_overrides[current_user] = lambda: {"uid": "bob"}
    assert tracker.get("/api/v1/recipes").json() == []
    assert tracker.get(f"/api/v1/recipes/{recipe['id']}").status_code == 404
    assert tracker.post("/api/v1/recipe-diary", json={"recipe_id": recipe["id"], "day": "2026-09-21", "amount": 1, "unit": "servings"}).status_code == 404
