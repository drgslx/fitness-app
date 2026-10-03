from datetime import date, timedelta

import pytest
from sqlalchemy import select

from test_articles import client
from test_profile import profile_client, save_profile
from test_energy import energy_client, workout, complete, steps
from app.api import profile as profile_api, activity as activity_api
from app.models.tracking import Workout, WorkoutLog

TODAY = date(2026, 10, 3)


@pytest.fixture
def recent_activity(energy_client, monkeypatch):
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY)
    monkeypatch.setattr(activity_api, "today_for", lambda _: TODAY)
    return energy_client


@pytest.mark.parametrize("count,level,factor", [
    (0, "sedentary", 1.2), (1, "light", 1.375), (2, "light", 1.375),
    (3, "moderate", 1.55), (4, "moderate", 1.55),
    (5, "high", 1.725), (6, "high", 1.725),
    (7, "very_high", 1.9), (9, "very_high", 1.9),
])
def test_activity_level_uses_all_executed_sessions_including_same_day(recent_activity, count, level, factor):
    test, _ = recent_activity
    save_profile(test, goal="maintain")
    # Deliberately put all workouts in one day to prevent day-based deduplication.
    for _ in range(count):
        complete(test, workout(test, day=str(TODAY)))
    report = test.get("/api/v1/energy").json()
    assert report["week"]["sessions"] == count
    assert report["week"]["training_days"] == bool(count)
    assert report["week"]["activity_level"] == level
    recommendation = test.get("/api/v1/profile").json()["recommendation"]
    assert recommendation["activity_level"] == level
    assert recommendation["training_sessions_7"] == count
    assert recommendation["maintenance_kcal"] == round(1775 * factor)


def test_box_gym_and_plyometrics_each_add_their_own_energy_to_day_and_maintenance(recent_activity):
    test, _ = recent_activity
    # Include rest days in the estimate, then train three times on the same day.
    for offset in range(1, 4):
        steps(test, day=TODAY - timedelta(days=offset), steps=0)
    boxing = workout(test, day=str(TODAY), title="Box", sport="Box", activity_type="boxing")
    complete(test, boxing, duration_minutes=60, intensity="high")
    first = steps(test, day=TODAY, steps=0)
    assert first["today"]["workout_net_kcal"] == 410
    before = test.get("/api/v1/profile").json()["active_goal"]["calories"]
    gym = workout(test, day=str(TODAY), title="Sala", activity_type="strength")
    complete(test, gym, duration_minutes=45, intensity="moderate")
    plyometrics = workout(test, day=str(TODAY), title="Pliometrie", sport="Pliometrie", activity_type="cardio")
    complete(test, plyometrics, duration_minutes=30, intensity="very_high")
    data = steps(test, day=TODAY, steps=0)
    day = data["today"]
    assert len(day["sessions"]) == 3
    assert day["training_minutes"] == 135
    assert [item["net_kcal"] for item in day["sessions"]] == [410, 154, 287]
    assert day["workout_net_kcal"] == 851
    assert day["estimated_kcal"] == round((1775 * 1.1 + 851) / .9)
    assert day["estimated_kcal"] > first["today"]["estimated_kcal"]
    assert data["week"]["sessions"] == 3 and data["week"]["training_days"] == 1
    assert data["week"]["activity_level"] == "moderate"
    profile = test.get("/api/v1/profile").json()
    assert profile["recommendation"]["maintenance_source"] == "activity_average"
    assert profile["active_goal"]["calories"] == data["planning_maintenance_kcal"]
    assert profile["active_goal"]["calories"] > before
    # Editing only one session's intensity updates the total without changing the others.
    complete(test, boxing, duration_minutes=60, intensity="very_high")
    changed = steps(test, day=TODAY, steps=0)
    assert changed["today"]["workout_net_kcal"] == 1015
    assert changed["planning_maintenance_kcal"] > data["planning_maintenance_kcal"]


def test_last_seven_days_cross_months_and_exclude_old_or_future_completions(recent_activity):
    test, session = recent_activity
    for day in (TODAY - timedelta(days=7), TODAY - timedelta(days=6), date(2026, 9, 30), TODAY):
        complete(test, workout(test, day=str(day)))
    future = workout(test, day=str(TODAY + timedelta(days=1)))
    # Simulate an invalid future completion created by the previous implementation.
    with session() as db:
        plan = db.get(Workout, future["id"])
        plan.duration_minutes = 60
        plan.intensity = "high"
        db.add(WorkoutLog(workout_id=plan.id, user_id=plan.user_id, day=plan.day,
                          snapshot={"title": plan.title, "sport": plan.sport, "exercises": []}))
        db.commit()
    week = test.get("/api/v1/energy").json()["week"]
    assert week["start"] == "2026-09-27" and week["end"] == "2026-10-03"
    assert week["sessions"] == 3 and week["activity_level"] == "moderate"
    profile = test.get("/api/v1/profile").json()["recommendation"]
    assert profile["activity_start"] == "2026-09-27" and profile["training_sessions_7"] == 3
    summary = test.get("/api/v1/profile/summary?start=2026-09-27&end=2026-10-04").json()
    assert summary["sessions"] == 3
    history = test.get("/api/v1/workout-history?start=2026-09-27&end=2026-10-04").json()
    assert len(history) == 3
    plans = test.get("/api/v1/workouts?start=2026-09-27&end=2026-10-04").json()
    planned_future = next(plan for plan in plans if plan["id"] == future["id"])
    assert planned_future["has_completion"] and not planned_future["completed"] and not planned_future["can_complete"]
    assert test.delete(f'/api/v1/workouts/{future["id"]}/completion').status_code == 204


def test_cannot_complete_future_session_or_move_completed_session_to_future(recent_activity):
    test, session = recent_activity
    future = workout(test, day=str(TODAY + timedelta(days=1)))
    response = test.put(f'/api/v1/workouts/{future["id"]}/completion',
                        json={"duration_minutes": 60, "intensity": "moderate"})
    assert response.status_code == 422
    with session() as db:
        assert db.scalar(select(WorkoutLog).where(WorkoutLog.workout_id == future["id"])) is None
        assert db.get(Workout, future["id"]).duration_minutes is None
    today = workout(test, day=str(TODAY))
    complete(test, today)
    body = {key: today[key] for key in ("day", "title", "sport", "exercises", "activity_type", "steps_included")}
    response = test.put(f'/api/v1/workouts/{today["id"]}', json={**body, "day": future["day"]})
    assert response.status_code == 422
    with session() as db:
        assert db.get(Workout, today["id"]).day == TODAY
