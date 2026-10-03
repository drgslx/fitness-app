from datetime import timedelta

import pytest
from sqlalchemy import select

from test_articles import client
from test_profile import profile_client, TODAY
from test_energy import energy_client, workout, complete, steps
from app.models.tracking import Workout, WorkoutLog


def test_completion_updates_history_energy_and_preserves_values_on_edit(energy_client):
    test, session = energy_client
    plan = workout(test)
    assert plan["duration_minutes"] is None and plan["intensity"] is None
    log = complete(test, plan, duration_minutes=30, intensity="high")
    assert log["snapshot"]["duration_minutes"] == 30
    assert log["snapshot"]["intensity"] == "high"
    first_day = steps(test)["today"]
    assert first_day["training_minutes"] == 30 and first_day["workout_net_kcal"] == 164
    # Saving exercise/title changes cannot erase or replace the execution details.
    body = {key: plan[key] for key in ("day", "title", "sport", "activity_type", "steps_included", "exercises")}
    updated = test.put(f'/api/v1/workouts/{plan["id"]}', json={**body, "title": "Changed"})
    assert updated.status_code == 200, updated.text
    assert updated.json()["duration_minutes"] == 30 and updated.json()["intensity"] == "high"
    steps(test)
    duplicate = complete(test, plan, duration_minutes=30, intensity="high")
    assert duplicate["id"] == log["id"]
    assert test.get("/api/v1/energy").json()["today"]["complete"]
    revised = complete(test, plan, duration_minutes=90, intensity="very_high")
    assert revised["id"] == log["id"] and revised["snapshot"]["title"] == "Changed"
    day = test.get("/api/v1/energy").json()["today"]
    assert not day["complete"]
    assert day["training_minutes"] == 90 and day["workout_net_kcal"] == 615
    assert day["estimated_kcal"] > first_day["estimated_kcal"]
    assert test.delete(f'/api/v1/workouts/{plan["id"]}/completion').status_code == 204
    with session() as db:
        saved = db.get(Workout, plan["id"])
        assert saved.duration_minutes is None and saved.intensity is None
        assert db.scalars(select(WorkoutLog)).all() == []
    assert test.get("/api/v1/energy").json()["today"]["sessions"] == []
    complete(test, plan, duration_minutes=45)
    assert test.get("/api/v1/energy").json()["today"]["training_minutes"] == 45


@pytest.mark.parametrize("payload", [
    None, {}, {"duration_minutes": 60}, {"intensity": "high"},
    {"duration_minutes": 0, "intensity": "moderate"},
    {"duration_minutes": -1, "intensity": "moderate"},
    {"duration_minutes": 601, "intensity": "moderate"},
    {"duration_minutes": 60, "intensity": "unknown"},
    {"duration_minutes": 60, "intensity": None},
    {"duration_minutes": 60, "intensity": "high", "user_id": "bob"},
])
def test_invalid_completion_keeps_session_planned(energy_client, payload):
    test, session = energy_client
    plan = workout(test)
    response = test.put(f'/api/v1/workouts/{plan["id"]}/completion', json=payload)
    assert response.status_code == 422, response.text
    with session() as db:
        assert db.scalars(select(WorkoutLog)).all() == []
        saved = db.get(Workout, plan["id"])
        assert saved.duration_minutes is None and saved.intensity is None


def test_plans_and_templates_do_not_accept_execution_measurements(energy_client):
    test, _ = energy_client
    for field, value in (("duration_minutes", 60), ("intensity", "high")):
        assert test.post("/api/v1/workouts", json={
            "day": str(TODAY), "title": "Planned", "sport": "Sala", field: value,
        }).status_code == 422
        assert test.post("/api/v1/workout-templates", json={
            "name": "Template", "sport": "Sala", field: value,
        }).status_code == 422


def test_one_template_seven_days_seven_independent_completed_sessions(energy_client):
    test, session = energy_client
    created = test.post("/api/v1/workout-templates", json={
        "name": "Daily", "sport": "Sala", "activity_type": "strength",
        "exercises": [{"name": "Squat", "sets": 3, "reps": 8, "weight_kg": 40}],
    })
    assert created.status_code == 201, created.text
    template = created.json()
    plans = []
    for offset in range(7):
        day = TODAY - timedelta(days=offset)
        response = test.post(f'/api/v1/workout-templates/{template["id"]}/sessions', json={"day": str(day)})
        assert response.status_code == 201, response.text
        plan = response.json()
        assert plan["duration_minutes"] is None and plan["intensity"] is None
        plans.append(plan)
    assert len({plan["id"] for plan in plans}) == 7
    assert test.get("/api/v1/energy").json()["week"]["sessions"] == 0
    for index, plan in enumerate(plans):
        complete(test, plan, duration_minutes=30 + index * 5, intensity="high")
        steps(test, day=plan["day"])
    report = test.get("/api/v1/energy").json()
    assert report["week"]["sessions"] == 7 and report["week"]["complete_days"] == 7
    assert report["week"]["training_minutes"] == 315
    profile = test.get("/api/v1/profile").json()
    assert profile["recommendation"]["maintenance_source"] == "activity_average"
    assert profile["active_goal"]["calories"] == report["planning_maintenance_kcal"]
    assert test.get(f'/api/v1/workout-templates/{template["id"]}').json() == template
    with session() as db:
        assert len(db.scalars(select(Workout)).all()) == 7
        assert len(db.scalars(select(WorkoutLog)).all()) == 7
    history = test.get(f'/api/v1/workout-history?start={TODAY - timedelta(days=6)}&end={TODAY}').json()
    assert len(history) == 7 and len({log["workout_id"] for log in history}) == 7
    query = f'?start={TODAY - timedelta(days=6)}&end={TODAY}'
    assert all(plan["completed"] for plan in test.get("/api/v1/workouts" + query).json())
    # Correcting one day's measurements changes only that session and refreshes the goal.
    before = report["planning_maintenance_kcal"]
    complete(test, plans[0], duration_minutes=120, intensity="very_high")
    assert not test.get("/api/v1/energy").json()["today"]["complete"]
    report = steps(test)
    assert report["planning_maintenance_kcal"] > before
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == report["planning_maintenance_kcal"]
    assert report["week"]["sessions"] == 7
