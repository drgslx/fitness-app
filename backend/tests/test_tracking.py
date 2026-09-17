import pytest
from test_articles import client  # reuse isolated DB fixture
from app.main import app
from app.core.security import current_user
from app.models.tracking import Nutrient, GoalType

@pytest.fixture
def tracker(client):
    test, session = client
    with session() as db:
        for key in ["carbohydrates", "protein", "fat", "salt"]:
            if not db.get(Nutrient,key): db.add(Nutrient(key=key, label=key, unit="g"))
        if not db.get(GoalType,"maintain"): db.add(GoalType(key="maintain",label="Maintain",description=""))
        db.commit()
    app.dependency_overrides[current_user] = lambda: {"uid":"alice"}
    return test

def food(test):
    response = test.post("/api/v1/foods",json={"name":"Example","calories":200,"nutrients":{"carbohydrates":30,"protein":10,"fat":4,"salt":0.2}})
    assert response.status_code == 201, response.text
    return response.json()

def test_workouts_owned_and_completion_snapshot(tracker):
    body={"day":"2026-09-21","title":"Strength","sport":"Gym","exercises":[{"name":"Squat","sets":3,"reps":8}]}
    r=tracker.post("/api/v1/workouts",json=body)
    assert r.status_code==201, r.text
    wid=r.json()["id"]
    assert tracker.put(f"/api/v1/workouts/{wid}/completion").status_code==200
    assert tracker.put(f"/api/v1/workouts/{wid}/completion").status_code==200
    body["title"]="Changed"
    assert tracker.put(f"/api/v1/workouts/{wid}",json=body).status_code==200
    query="?start=2026-09-21&end=2026-09-27"
    logs=tracker.get("/api/v1/workout-history"+query).json()
    assert len(logs)==1 and logs[0]["snapshot"]["title"]=="Strength"
    app.dependency_overrides[current_user]=lambda:{"uid":"bob"}
    assert tracker.get("/api/v1/workouts"+query).json()==[]
    assert tracker.put(f"/api/v1/workouts/{wid}",json=body).status_code==404
    assert tracker.delete(f"/api/v1/workouts/{wid}").status_code==404
    assert tracker.put(f"/api/v1/workouts/{wid}/completion").status_code==404

def test_nutrition_snapshots_portions_reports_and_isolation(tracker):
    f=food(tracker)
    body={"food_id":f["id"],"day":"2026-09-21","grams":150,"meal":"Lunch"}
    r=tracker.post("/api/v1/diary",json=body);assert r.status_code==201
    eid=r.json()["id"]
    assert tracker.put("/api/v1/goals",json={"effective_from":"2026-09-21","goal_type":"maintain","calories":2000,"protein":100}).status_code==200
    updated={"name":"Changed","calories":900,"nutrients":f["nutrients"]}
    assert tracker.put(f'/api/v1/foods/{f["id"]}',json=updated).status_code==200
    report=tracker.get("/api/v1/nutrition-report?start=2026-09-21&end=2026-09-27").json()
    assert report["days"][0]["calories"]==300
    assert report["days"][0]["nutrients"]["protein"]==15
    assert report["days"][0]["difference"]==-1700
    assert report["weeks"][0]["daily_average_logged_days"]==300
    assert report["weeks"][0]["logged_days"]==1
    body["grams"]=200
    assert tracker.put(f"/api/v1/diary/{eid}",json=body).status_code==200
    assert tracker.get("/api/v1/nutrition-report?start=2026-09-21&end=2026-09-21").json()["days"][0]["calories"]==400
    app.dependency_overrides[current_user]=lambda:{"uid":"bob"}
    assert tracker.get("/api/v1/diary?day=2026-09-21").json()==[]
    assert tracker.delete(f"/api/v1/diary/{eid}").status_code==404
    assert tracker.put(f"/api/v1/diary/{eid}",json=body).status_code==404
    assert tracker.put(f'/api/v1/foods/{f["id"]}',json=updated).status_code==403
    assert tracker.get("/api/v1/goals").json()==[]

def test_only_admin_defines_nutrients_and_goals(tracker):
    nutrient={"key":"fiber","label":"Fiber","unit":"g"}
    assert tracker.post("/api/v1/nutrients",json=nutrient).status_code==403
    assert tracker.post("/api/v1/goal-types",json={"key":"endurance","label":"Endurance"}).status_code==403
    app.dependency_overrides[current_user]=lambda:{"uid":"admin","admin":True}
    assert tracker.post("/api/v1/nutrients",json=nutrient).status_code==201
    assert tracker.post("/api/v1/nutrients",json=nutrient).status_code==409
    assert tracker.post("/api/v1/goal-types",json={"key":"endurance","label":"Endurance"}).status_code==201

def test_invalid_quantity_and_date_range(tracker):
    f=food(tracker)
    assert tracker.post("/api/v1/diary",json={"food_id":f["id"],"grams":-1,"day":"2026-09-21"}).status_code==422
    assert tracker.get("/api/v1/nutrition-report?start=2026-09-27&end=2026-09-21").status_code==422
    assert tracker.post("/api/v1/foods",json={"name":"Invalid","calories":50,"nutrients":{"unknown":10}}).status_code==422
