from datetime import timedelta

import pytest
from sqlalchemy import select

from test_articles import client
from test_profile import BASE, TODAY, profile_client, save_profile
from test_energy import energy_client, workout, complete, steps
from app.api import profile as profile_api
from app.models.profile import BodyWeight
from app.models.tracking import NutritionGoal, SportType, Workout, WorkoutLog


def insert_session(db, *, day=TODAY, minutes=60, uid="alice", log_uid="alice",
                   completed=True, sport="Sala", sport_id=None):
    plan = Workout(user_id=uid, day=day, title="Session", sport=sport,
                   sport_type_id=sport_id, duration_minutes=minutes)
    db.add(plan)
    db.flush()
    if completed:
        db.add(WorkoutLog(user_id=log_uid, workout_id=plan.id, day=day, snapshot={}))
    return plan


@pytest.mark.parametrize("count,level,factor", [
    (0, "sedentary", 1.2), (1, "light", 1.375), (2, "light", 1.375),
    (3, "moderate", 1.55), (4, "moderate", 1.55), (5, "high", 1.725),
    (6, "high", 1.725), (7, "very_high", 1.9), (8, "very_high", 1.9),
])
def test_session_count_buckets_use_current_plans_without_rewriting_signup_activity(energy_client, count, level, factor):
    test, session = energy_client
    with session() as db:
        for _ in range(count):
            insert_session(db)
        db.commit()
    result = test.get("/api/v1/profile").json()
    assert result["activity_summary"] == {
        "source": "sessions", "activity_level": level,
        "eligible_sessions_7": count, "start": str(TODAY - timedelta(days=6)),
        "end": str(TODAY), "min_duration_minutes": 15, "missing_duration_sessions": 0,
    }
    assert result["profile"]["activity_level"] == "moderate"
    assert result["edit_permissions"]["activity_level"] is False
    rec = result["recommendation"]
    assert rec["inputs"]["activity_level"] == level
    assert rec["activity_factor"] == factor
    assert rec["maintenance_kcal"] == round(1775 * factor)
    assert rec["maintenance_source"] == "sessions"


def test_eligibility_window_duration_completion_ownership_and_active_sports(energy_client):
    test, session = energy_client
    with session() as db:
        active = SportType(user_id="alice", name="Active", is_active=True)
        archived = SportType(user_id="alice", name="Archived", is_active=False)
        foreign = SportType(user_id="bob", name="Other", is_active=True)
        db.add_all([active, archived, foreign])
        db.flush()
        insert_session(db, day=TODAY - timedelta(days=6), minutes=15.01, sport_id=active.id)
        insert_session(db, day=TODAY, minutes=16)
        insert_session(db, day=TODAY - timedelta(days=7))
        insert_session(db, day=TODAY + timedelta(days=1))
        for minutes in (None, 0, 10, 15):
            insert_session(db, minutes=minutes)
        insert_session(db, completed=False)
        insert_session(db, uid="bob", log_uid="bob")
        insert_session(db, uid="alice", log_uid="bob")
        insert_session(db, uid="bob", log_uid="alice")
        insert_session(db, sport_id=archived.id)
        insert_session(db, sport="Archived")
        insert_session(db, sport_id=foreign.id)
        db.commit()
    result = test.get("/api/v1/profile").json()
    assert result["activity_summary"]["eligible_sessions_7"] == 2
    assert result["activity_summary"]["activity_level"] == "light"
    assert result["activity_summary"]["missing_duration_sessions"] == 1


def test_signup_activity_stays_locked_without_with_and_after_eligible_sessions(energy_client):
    test, _ = energy_client
    first = test.get("/api/v1/profile").json()
    assert first["activity_summary"]["activity_level"] == "sedentary"
    assert test.put("/api/v1/profile", json={**BASE, "activity_level": "high"}).status_code == 422
    short = workout(test, duration_minutes=15)
    complete(test, short)
    save_profile(test, goal="maintain")
    plan = workout(test)
    complete(test, plan)
    rejected = test.put("/api/v1/profile", json={**BASE, "activity_level": "very_high", "goal": "gain"})
    assert rejected.status_code == 422
    result = test.get("/api/v1/profile").json()
    assert result["profile"]["activity_level"] == "moderate"
    assert result["profile"]["goal"] == "maintain"
    allowed = save_profile(test, goal="gain")
    assert allowed["recommendation"]["inputs"]["activity_level"] == "light"
    assert test.delete(f'/api/v1/workouts/{plan["id"]}/completion').status_code == 204
    result = test.get("/api/v1/profile").json()
    assert result["activity_summary"]["activity_level"] == "sedentary"
    assert result["edit_permissions"]["activity_level"] is False
    assert test.put("/api/v1/profile", json={**BASE, "activity_level": "sedentary"}).status_code == 422


def test_session_mutations_recalculate_automatic_target_and_return_to_sedentary(energy_client):
    test, _ = energy_client
    initial = test.get("/api/v1/profile").json()["active_goal"]["calories"]
    plans = [workout(test) for _ in range(3)]
    complete(test, plans[0])
    one = test.get("/api/v1/profile").json()
    assert one["active_goal"]["calories"] == round(1775 * 1.375)
    assert one["active_goal"]["calculation"]["activity_level"] == "light"
    for plan in plans[1:]:
        complete(test, plan)
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == round(1775 * 1.55)
    body = {key: plans[0][key] for key in (
        "day", "title", "sport", "exercises", "activity_type", "intensity", "steps_included")}
    edited = test.put(f'/api/v1/workouts/{plans[0]["id"]}', json={**body, "duration_minutes": 15})
    assert edited.status_code == 200, edited.text
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == one["active_goal"]["calories"]
    assert test.delete(f'/api/v1/workouts/{plans[1]["id"]}/completion').status_code == 204
    assert test.get("/api/v1/profile").json()["activity_summary"]["eligible_sessions_7"] == 1
    assert test.delete(f'/api/v1/workouts/{plans[2]["id"]}').status_code == 204
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == initial
    sport = test.post("/api/v1/sport-types", json={"name": "Cycling", "activity_type": "cycling"}).json()
    plan = workout(test, sport_type_id=sport["id"])
    complete(test, plan)
    assert test.get("/api/v1/profile").json()["activity_summary"]["eligible_sessions_7"] == 1
    assert test.delete(f'/api/v1/sport-types/{sport["id"]}').status_code == 204
    archived = test.get("/api/v1/profile").json()
    assert archived["activity_summary"]["eligible_sessions_7"] == 0
    assert archived["active_goal"]["calories"] == initial


def test_complete_day_average_does_not_override_sessions_and_short_sessions_keep_daily_calories(energy_client):
    test, _ = energy_client
    short = workout(test, duration_minutes=15)
    complete(test, short)
    long = workout(test)
    complete(test, long)
    for offset in range(4):
        report = steps(test, TODAY - timedelta(days=offset))
    result = test.get("/api/v1/profile").json()
    assert result["activity_summary"]["eligible_sessions_7"] == 1
    assert result["recommendation"]["maintenance_source"] == "sessions"
    assert result["recommendation"]["maintenance_kcal"] == round(1775 * 1.375)
    assert report["planning_maintenance_kcal"] is not None
    assert report["today"]["workout_net_kcal"] == 205 + round(205 / 4)


def test_rollover_gets_update_recommendation_without_writing_goal_history(energy_client, monkeypatch):
    test, session = energy_client
    plan = workout(test, day=str(TODAY - timedelta(days=6)))
    complete(test, plan)
    before = test.get("/api/v1/profile").json()
    with session() as db:
        count = len(db.scalars(select(NutritionGoal)).all())
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY + timedelta(days=1))
    after = test.get("/api/v1/profile").json()
    assert after["activity_summary"]["eligible_sessions_7"] == 0
    assert after["recommendation"]["maintenance_source"] == "sessions"
    assert after["recommendation"]["maintenance_kcal"] == round(1775 * 1.2)
    assert after["active_goal"] == before["active_goal"]
    with session() as db:
        assert len(db.scalars(select(NutritionGoal)).all()) == count


def test_historical_no_data_fallback_uses_its_own_rolling_window(energy_client):
    test, session = energy_client
    first_day = TODAY - timedelta(days=27)
    with session() as db:
        db.add(BodyWeight(user_id="alice", day=first_day - timedelta(days=6), weight_kg=82))
        insert_session(db, day=first_day - timedelta(days=6))
        for _ in range(7):
            insert_session(db)
        db.commit()
    report = test.get("/api/v1/energy").json()
    historical = report["days"][0]
    assert historical["mode"] == "fallback"
    assert historical["activity_summary"]["eligible_sessions_7"] == 1
    assert historical["estimated_kcal"] == round(1775 * 1.375)
    following_day = report["days"][1]
    assert following_day["activity_summary"]["eligible_sessions_7"] == 0
    assert following_day["estimated_kcal"] == round(1775 * 1.2)
    assert report["activity_summary"]["activity_level"] == "very_high"


def test_session_sync_preserves_prior_day_goal_snapshot(energy_client, monkeypatch):
    test, _ = energy_client
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY - timedelta(days=1))
    old = save_profile(test, goal="maintain")["active_goal"]
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY)
    plan = workout(test)
    complete(test, plan)
    goals = test.get("/api/v1/goals").json()
    previous = next(goal for goal in goals if goal["effective_from"] == str(TODAY - timedelta(days=1)))
    assert previous == old
    assert test.get("/api/v1/profile").json()["active_goal"]["calories"] == round(1775 * 1.375)


def test_session_changes_preserve_manual_calorie_target(energy_client):
    test, _ = energy_client
    manual = {"effective_from": str(TODAY), "goal_type": "maintain", "calories": 2100, "protein": 120}
    assert test.put("/api/v1/goals", json=manual).status_code == 200
    plan = workout(test)
    complete(test, plan)
    result = test.get("/api/v1/profile").json()
    assert result["activity_summary"]["activity_level"] == "light"
    assert result["active_goal"]["calories"] == 2100
    assert result["active_goal"]["protein"] == 120
    assert result["active_goal"]["source"] == "manual"
    assert result["profile"]["auto_calories"] is False
