from datetime import timedelta
import json
import os
import subprocess
import sys
from pathlib import Path
import pytest
from sqlalchemy import create_engine, select, text
from test_articles import client
from test_profile import profile_client, save_profile, save_weight, TODAY
from app.api import activity as activity_api
from app.core.security import current_user
from app.main import app
from app.models.tracking import WorkoutExercise, NutritionGoal

@pytest.fixture
def energy_client(profile_client, monkeypatch):
    monkeypatch.setattr(activity_api, "today_for", lambda _: TODAY)
    test, session = profile_client
    save_profile(test, goal="maintain")
    save_weight(test, "2026-09-01", 82)
    return test, session


def steps(test, day=TODAY, **changes):
    response = test.put(f"/api/v1/daily-activity/{day}", json={"steps": 8000, "steps_scope": "outside_workouts", "complete": True, **changes})
    assert response.status_code == 200, response.text
    return response.json()


def workout(test, **changes):
    result = test.post("/api/v1/workouts", json={"day": str(TODAY), "title": "Sala", "sport": "Sala", "exercises": [],
        "activity_type": "strength", "steps_included": 0, **changes})
    assert result.status_code == 201, result.text
    return result.json()


def complete(test, plan, **changes):
    result = test.put(f'/api/v1/workouts/{plan["id"]}/completion',
                      json={"duration_minutes": 60, "intensity": "moderate", **changes})
    assert result.status_code == 200, result.text
    return result.json()


def test_energy_components_and_no_multiplier_double_counting(energy_client):
    test, _ = energy_client
    plan = workout(test)
    assert test.get("/api/v1/energy").json()["today"]["sessions"] == []
    complete(test, plan)
    day = steps(test)["today"]
    assert day["complete"]
    assert day["workout_net_kcal"] == round((3.5 - 1) * 82)
    walking = 8000 * 1.76 * .414 / 1000 * 82 * .5
    assert day["estimated_kcal"] == round((1775 * 1.1 + walking + 205) / .9)
    assert day["walking_net_kcal"] == round(walking)
    assert day["estimated_kcal"] < 1775 * 1.55 + walking + 205


def test_overlap_unknown_zero_steps_and_missing_days(energy_client):
    test, _ = energy_client
    plan = workout(test, activity_type="running", steps_included=None)
    complete(test, plan)
    data = steps(test, steps_scope="total")
    assert not data["today"]["complete"]
    assert data["today"]["walking_net_kcal"] is None
    assert data["week"]["complete_days"] == 0
    body = {k: plan[k] for k in ("day", "title", "sport", "exercises", "activity_type")}
    test.put(f'/api/v1/workouts/{plan["id"]}', json={**body, "steps_included": 3000})
    day = steps(test, steps_scope="total")["today"]
    assert day["walking_steps"] == 5000 and day["complete"]
    day = steps(test, steps=100, steps_scope="total")["today"]
    assert not day["complete"] and day["walking_net_kcal"] is None
    test.delete(f'/api/v1/workouts/{plan["id"]}/completion')
    day = steps(test, steps=0)["today"]
    assert day["walking_net_kcal"] == 0 and day["complete"]
    assert test.get("/api/v1/energy").json()["days"][-2]["complete"] is False


def test_weekly_planning_threshold_manual_override_and_edit_sync(energy_client):
    test, session = energy_client
    for offset in range(3): steps(test, TODAY - timedelta(days=offset))
    assert test.get("/api/v1/profile").json()["recommendation"]["maintenance_source"] == "training_frequency"
    result = steps(test, TODAY - timedelta(days=3))
    profile = test.get("/api/v1/profile").json()
    assert profile["recommendation"]["maintenance_source"] == "activity_average"
    assert profile["active_goal"]["calories"] == result["planning_maintenance_kcal"]
    before = result["planning_maintenance_kcal"]
    result = steps(test, steps=15000)
    assert result["planning_maintenance_kcal"] > before
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == result["planning_maintenance_kcal"]
    test.put("/api/v1/goals", json={"effective_from": str(TODAY), "goal_type": "maintain", "calories": 2100, "protein": 120})
    steps(test, steps=2000)
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == 2100
    with session() as db: count = len(db.scalars(select(NutritionGoal)).all())
    test.get("/api/v1/energy")
    test.get("/api/v1/profile")
    with session() as db: assert len(db.scalars(select(NutritionGoal)).all()) == count


def test_edit_delete_archive_and_session_references(energy_client):
    test, session = energy_client
    sport = test.post("/api/v1/sport-types", json={"name": "Sala", "activity_type": "strength", "default_duration_minutes": 65}).json()
    definition = test.post(f'/api/v1/sport-types/{sport["id"]}/exercises', json={"name": "Squat", "tracking_type": "strength"}).json()
    plan = workout(test, sport_type_id=sport["id"], exercises=[{"exercise_id": definition["id"], "name": "Spoof name", "sets": 3, "reps": 10}])
    assert plan["exercises"][0]["name"] == "Squat"
    with session() as db: assert db.scalar(select(WorkoutExercise)).exercise_id == definition["id"]
    complete(test, plan)
    assert steps(test)["today"]["workout_net_kcal"] == 205
    complete(test, plan, duration_minutes=120)
    energy = test.get("/api/v1/energy").json()["today"]
    assert energy["workout_net_kcal"] == 410 and not energy["complete"]
    test.delete(f'/api/v1/sport-types/{sport["id"]}')
    assert test.get("/api/v1/energy").json()["today"]["sessions"] == []
    test.delete(f'/api/v1/workouts/{plan["id"]}')
    with session() as db: assert db.scalars(select(WorkoutExercise)).all() == []


def test_ownership_invalid_fields_and_historical_weight(energy_client):
    test, _ = energy_client
    for payload in [{"steps": -1}, {"steps": 100001}, {"steps": 1.5}, {"steps": 1, "user_id": "bob"}, {"complete": True}]:
        assert test.put(f"/api/v1/daily-activity/{TODAY}", json=payload).status_code == 422
    assert test.put("/api/v1/daily-activity/2099-01-01", json={"steps": 100}).status_code == 422
    data = steps(test)
    assert data["days"][0]["available"] is False
    plan = workout(test)
    complete(test, plan)
    app.dependency_overrides[current_user] = lambda: {"uid": "bob"}
    assert test.get("/api/v1/energy").json()["available"] is False
    assert test.delete(f"/api/v1/daily-activity/{TODAY}").status_code == 404
    assert test.put(f'/api/v1/workouts/{plan["id"]}/completion',
                    json={"duration_minutes": 60, "intensity": "moderate"}).status_code == 404
    assert test.put("/api/v1/sport-types/1/defaults", json={"activity_type": "strength"}).status_code == 404


def test_template_activity_preserved_and_missing_activity_not_invented(energy_client):
    test, _ = energy_client
    template = test.post("/api/v1/workout-templates", json={"name": "Box", "sport": "Box", "activity_type": "boxing",
                        "exercises": []}).json()
    assert "duration_minutes" not in template and "intensity" not in template
    plan = test.post(f'/api/v1/workout-templates/{template["id"]}/sessions', json={"day": str(TODAY)}).json()
    assert plan["activity_type"] == "boxing"
    assert plan["duration_minutes"] is None and plan["intensity"] is None and plan["steps_included"] is None
    old = workout(test, activity_type=None)
    complete(test, old)
    day = steps(test)["today"]
    assert not day["complete"] and day["sessions"][0]["net_kcal"] is None


def test_migration_backfills_exercises_without_losing_performance(tmp_path):
    url = f"sqlite:///{tmp_path / 'energy.sqlite'}"
    root = Path(__file__).resolve().parents[1]
    def migrate(direction, revision):
        result = subprocess.run([sys.executable, "-m", "alembic", direction, revision], cwd=root,
            env={**os.environ, "DATABASE_URL": url}, capture_output=True, text=True)
        assert result.returncode == 0, result.stderr
    migrate("upgrade", "0006_user_profile")
    engine = create_engine(url)
    original = [{"exercise_id": None, "name": "Legacy", "sets": 2, "reps": 8, "weight_kg": 20, "minutes": None, "notes": "keep"}]
    with engine.begin() as conn:
        conn.execute(text("INSERT INTO workouts (user_id,day,title,sport,notes,exercises) VALUES ('alice','2026-09-26','Old','Sala','',:ex)"), {"ex": json.dumps(original)})
    migrate("upgrade", "head")
    with engine.connect() as conn:
        row = conn.execute(text('SELECT legacy_name, "values" FROM workout_exercises')).one()
        assert row[0] == "Legacy" and json.loads(row[1])["weight_kg"] == 20
        assert conn.execute(text("SELECT duration_minutes FROM workouts")).scalar() is None
    migrate("downgrade", "0006_user_profile")
    with engine.connect() as conn: assert json.loads(conn.execute(text("SELECT exercises FROM workouts")).scalar()) == original
    migrate("upgrade", "head")
    engine.dispose()
