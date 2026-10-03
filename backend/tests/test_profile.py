from datetime import date
from types import SimpleNamespace

import pytest
from sqlalchemy import select

from test_articles import client
from app.api import profile as profile_api
from app.core.security import current_user
from app.main import app
from app.models.profile import BodyWeight, UserProfile
from app.models.recipe import RecipeDiaryEntry
from app.models.tracking import DiaryEntry, GoalType, NutritionGoal, SportType, Workout, WorkoutLog
from app.services.profile import estimate

TODAY = date(2026, 9, 26)
BASE = dict(sex="male", birth_date="1996-01-01", height_cm=176,
            activity_level="moderate", goal="lose", deficit_percent=10, surplus_percent=10,
            auto_calories=True, timezone="Europe/Bucharest")


@pytest.fixture
def profile_client(client, monkeypatch):
    test, session = client
    monkeypatch.setattr(profile_api, "today_for", lambda profile: TODAY)
    app.dependency_overrides[current_user] = lambda: {"uid": "alice", "email": "alice@example.test"}
    with session() as db:
        for key in ("lose", "maintain", "gain"):
            db.add(GoalType(key=key, label=key, description=""))
        db.commit()
    return test, session


def save_profile(test, **changes):
    result = test.put("/api/v1/profile", json={**BASE, **changes})
    assert result.status_code == 200, result.text
    return result.json()


def save_weight(test, day="2026-09-26", weight=82):
    result = test.put("/api/v1/profile/weights", json={"day": day, "weight_kg": weight})
    assert result.status_code == 200, result.text
    return result.json()


def test_first_setup_persists_registration_data_and_locks_identity(profile_client):
    test, _ = profile_client
    empty = test.get("/api/v1/profile").json()
    assert empty["profile"] is None
    assert all(empty["edit_permissions"].values())
    registered = save_profile(test, goal="maintain")
    loaded = test.get("/api/v1/profile").json()
    for field in ("sex", "birth_date", "height_cm", "activity_level"):
        assert loaded["profile"][field] == BASE[field]
    assert loaded["profile"]["goal"] == "maintain"
    assert loaded["edit_permissions"] == registered["edit_permissions"] == {
        "sex": False, "birth_date": False, "height_cm": False,
        "activity_level": False, "goal": True,
    }


@pytest.mark.parametrize("field,value", [
    ("sex", "female"), ("birth_date", "2012-01-01"),
    ("height_cm", 180), ("activity_level", "high"),
])
def test_saved_adult_profile_rejects_locked_changes_atomically(profile_client, field, value):
    test, _ = profile_client
    save_profile(test)
    before = save_weight(test)
    attempted = test.put("/api/v1/profile", json={**BASE, field: value, "goal": "gain"})
    assert attempted.status_code == 422
    after = test.get("/api/v1/profile").json()
    assert after["profile"] == before["profile"]
    assert after["active_goal"] == before["active_goal"]


def test_goal_and_estimation_controls_remain_editable(profile_client):
    test, _ = profile_client
    save_profile(test)
    before = save_weight(test)
    updated = save_profile(test, goal="gain", surplus_percent=15, target_weight_kg=90)
    assert updated["profile"]["goal"] == "gain"
    assert updated["recommendation"]["target_kcal"] > before["recommendation"]["target_kcal"]
    assert updated["active_goal"]["goal_type"] == "gain"
    suspended = save_profile(test, pregnant_or_breastfeeding=True)
    assert not suspended["recommendation"]["available"]
    assert suspended["active_goal"] is None
    manual = save_profile(test, auto_calories=False)
    assert manual["profile"]["auto_calories"] is False


def test_minor_can_update_height_until_eighteenth_birthday(profile_client, monkeypatch):
    test, _ = profile_client
    birthday = "2008-09-27"
    initial = save_profile(test, birth_date=birthday)
    assert initial["edit_permissions"]["height_cm"] is True
    updated = save_profile(test, birth_date=birthday, height_cm=180)
    assert updated["profile"]["height_cm"] == 180
    assert not save_weight(test)["recommendation"]["available"]
    monkeypatch.setattr(profile_api, "today_for", lambda _: date(2026, 9, 27))
    assert test.get("/api/v1/profile").json()["edit_permissions"]["height_cm"] is False
    assert test.put("/api/v1/profile", json={**BASE, "birth_date": birthday, "height_cm": 181}).status_code == 422
    allowed = save_profile(test, birth_date=birthday, height_cm=180, goal="maintain")
    assert allowed["profile"]["goal"] == "maintain"


def test_minor_cannot_change_locked_registration_fields(profile_client):
    test, _ = profile_client
    birthday = "2012-01-01"
    save_profile(test, birth_date=birthday)
    for field, value in (("sex", "female"), ("birth_date", "2013-01-01")):
        assert test.put("/api/v1/profile", json={**BASE, "birth_date": birthday, field: value}).status_code == 422


@pytest.mark.parametrize("sex,rest", [("male", 1775), ("female", 1609)])
@pytest.mark.parametrize("goal,adjustment", [("lose", -.10), ("maintain", 0), ("gain", .10)])
def test_formula_and_goal_adjustments(profile_client, sex, rest, goal, adjustment):
    test, _ = profile_client
    initial = save_profile(test, sex=sex, goal=goal)
    assert not initial["recommendation"]["available"]
    result = save_weight(test)
    estimate = result["recommendation"]
    assert estimate["resting_kcal"] == rest
    # No completed sessions means sedentary, independently of signup activity.
    assert estimate["inputs"]["activity_level"] == "sedentary"
    assert estimate["maintenance_kcal"] == round(rest * 1.2)
    assert estimate["target_kcal"] == round(rest * 1.2 * (1 + adjustment))
    assert result["active_goal"]["calories"] == estimate["target_kcal"]
    assert result["active_goal"]["source"] == "profile"
    assert result["active_goal"]["goal_type"] == goal
    assert len(estimate["options"]) == {"lose": 3, "maintain": 1, "gain": 4}[goal]


@pytest.mark.parametrize("field,value", [("deficit_percent", 25), ("deficit_percent", 5),
    ("surplus_percent", 25), ("height_cm", -176), ("sex", "unknown"), ("activity_level", "custom"),
    ("birth_date", "2099-01-01"), ("timezone", "not/a/timezone"), ("user_id", "bob")])
def test_reject_invalid_profile_input(profile_client, field, value):
    test, _ = profile_client
    assert test.put("/api/v1/profile", json={**BASE, field: value}).status_code == 422


def test_history_recalculates_from_latest_weight_and_preserves_past_goals(profile_client, monkeypatch):
    test, session = profile_client
    monkeypatch.setattr(profile_api, "today_for", lambda _: date(2026, 8, 26))
    save_profile(test)
    old = save_weight(test, "2026-08-26", 82)["active_goal"]
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY)
    updated = save_weight(test, weight=79)
    assert updated["active_goal"]["calories"] < old["calories"]
    assert updated["weight_change_kg"] == -3
    before = updated["active_goal"]["calories"]
    # Backdated entries do not replace the latest weight or rewrite historical targets.
    result = save_weight(test, "2026-08-01", 90)
    assert result["recommendation"]["weight_kg"] == 79
    assert result["active_goal"]["calories"] == before
    # Same date is a correction, not an additional observation.
    result = save_weight(test, weight=80)
    assert len(result["weights"]) == 3
    assert result["recommendation"]["weight_kg"] == 80
    history = test.get("/api/v1/goals").json()
    assert len(history) == 2
    assert history[-1]["calories"] == old["calories"]
    assert history[-1]["calculation"]["weight_kg"] == 82
    deleted = test.delete(f'/api/v1/profile/weights/{result["weights"][0]["id"]}').json()
    assert deleted["recommendation"]["weight_kg"] == 82
    assert deleted["active_goal"]["calories"] == old["calories"]
    with session() as db:
        assert db.scalar(select(NutritionGoal).where(NutritionGoal.effective_from == date(2026, 8, 26))).calories == old["calories"]


def test_deleted_last_weight_suspends_target_without_old_goal_fallback(profile_client, monkeypatch):
    test, session = profile_client
    monkeypatch.setattr(profile_api, "today_for", lambda _: date(2026, 9, 25))
    save_profile(test)
    previous = save_weight(test, "2026-09-25")
    monkeypatch.setattr(profile_api, "today_for", lambda _: TODAY)
    with session() as db:
        for day in (date(2026, 9, 25), TODAY):
            db.add(DiaryEntry(user_id="alice", day=day, meal="Pranz", food_id=1, grams=100,
                              snapshot={"calories": 200, "nutrients": {}}))
        db.commit()
    result = test.delete(f'/api/v1/profile/weights/{previous["weights"][0]["id"]}').json()
    assert result["active_goal"] is None
    assert not result["recommendation"]["available"]
    report = test.get("/api/v1/nutrition-report?start=2026-09-25&end=2026-09-26").json()
    assert report["days"][0]["target"] == previous["active_goal"]["calories"]
    assert report["days"][1]["target"] is None
    restored = save_weight(test, weight=81)
    assert restored["active_goal"] is not None
    assert restored["active_goal"]["effective_from"] == TODAY.isoformat()


def test_manual_goal_pauses_automatic_updates_and_preserves_protein(profile_client):
    test, _ = profile_client
    save_profile(test)
    save_weight(test)
    manual = dict(effective_from="2026-09-26", goal_type="maintain", calories=2300, protein=140)
    assert test.put("/api/v1/goals", json=manual).status_code == 200
    result = save_weight(test, weight=78)
    assert result["profile"]["auto_calories"] is False
    assert result["active_goal"]["calories"] == 2300
    assert result["active_goal"]["source"] == "manual"
    resumed = save_profile(test)
    assert resumed["active_goal"]["calories"] == resumed["recommendation"]["target_kcal"]
    assert resumed["active_goal"]["protein"] == 140


def test_isolation_auth_and_spoofing(profile_client):
    test, _ = profile_client
    save_profile(test)
    alice = save_weight(test)
    app.dependency_overrides[current_user] = lambda: {"uid": "bob"}
    bob = test.get("/api/v1/profile").json()
    assert bob["profile"] is None and bob["weights"] == [] and bob["active_goal"] is None
    assert test.delete(f'/api/v1/profile/weights/{alice["weights"][0]["id"]}').status_code == 404
    assert test.put("/api/v1/profile/weights", json={"day": "2026-09-26", "weight_kg": 80}).status_code == 409
    save_profile(test, goal="maintain")
    save_weight(test, weight=100)
    app.dependency_overrides[current_user] = lambda: {"uid": "alice"}
    assert test.get("/api/v1/profile").json()["weights"][0]["weight_kg"] == 82
    assert test.put("/api/v1/profile/weights", json={"day": "2026-09-26", "weight_kg": 80, "user_id": "bob"}).status_code == 422
    app.dependency_overrides.pop(current_user)
    assert test.get("/api/v1/profile").status_code == 401
    assert test.get("/api/v1/profile/summary?start=2026-09-01&end=2026-09-26").status_code == 401


@pytest.mark.parametrize("changes,weight", [({"birth_date": "2015-01-01"}, 82),
    ({"pregnant_or_breastfeeding": True}, 82), ({}, 50), ({"target_weight_kg": 45}, 82)])
def test_ineligible_estimates_do_not_generate_calorie_targets(profile_client, changes, weight):
    test, _ = profile_client
    save_profile(test, **changes)
    result = save_weight(test, weight=weight)
    assert not result["recommendation"]["available"]
    assert result["active_goal"] is None


def test_future_invalid_weights_and_goal_reached(profile_client):
    test, _ = profile_client
    save_profile(test, target_weight_kg=80)
    for day, weight in [("2026-09-27", 82), ("1990-01-01", 82), ("2026-09-26", -1)]:
        assert test.put("/api/v1/profile/weights", json={"day": day, "weight_kg": weight}).status_code == 422
    result = save_weight(test, weight=79)
    assert result["recommendation"]["target_reached"] is True
    assert result["active_goal"]["goal_type"] == "maintain"
    assert result["recommendation"]["target_kcal"] == result["recommendation"]["maintenance_kcal"]


def test_signup_activity_does_not_replace_current_session_activity(profile_client):
    test, _ = profile_client
    save_profile(test, goal="maintain", deficit_percent=20, activity_level="sedentary")
    low = save_weight(test)["recommendation"]
    app.dependency_overrides[current_user] = lambda: {"uid": "bob"}
    save_profile(test, goal="maintain", deficit_percent=20, activity_level="high")
    high = save_weight(test)["recommendation"]
    assert low["target_kcal"] == round(1775 * 1.2)
    assert high["target_kcal"] == low["target_kcal"]
    assert high["inputs"]["activity_level"] == "sedentary"
    assert test.get("/api/v1/profile").json()["profile"]["activity_level"] == "high"
    assert high["adjustment_percent"] == 0


def test_summary_uses_live_diary_recipes_completed_workouts_and_ownership(profile_client):
    test, session = profile_client
    with session() as db:
        db.add_all([SportType(user_id="alice", name="Sala", is_active=True),
                    SportType(user_id="alice", name="Arhivat", is_active=False)])
        plans = []
        for uid, sport, completed in [("alice", "Sala", True), ("alice", "Sala", False),
                                      ("alice", "Arhivat", True), ("bob", "Sala", True)]:
            plan = Workout(user_id=uid, day=TODAY, title="Plan", sport=sport, notes="", exercises=[])
            db.add(plan)
            db.flush()
            if completed:
                db.add(WorkoutLog(user_id=uid, workout_id=plan.id, day=TODAY, snapshot={}))
            plans.append(plan.id)
        entry = DiaryEntry(user_id="alice", day=TODAY, meal="Pranz", food_id=1, grams=100,
                           snapshot={"calories": 200, "nutrients": {}})
        db.add(entry)
        db.add(RecipeDiaryEntry(user_id="alice", recipe_id=1, day=TODAY, meal="Cina", grams=200,
                               servings=1, quantity_unit="servings", snapshot={"calories": 150, "nutrients": {}}))
        db.add(DiaryEntry(user_id="bob", day=TODAY, meal="Pranz", food_id=1, grams=100,
                         snapshot={"calories": 900, "nutrients": {}}))
        db.commit()
        entry_id = entry.id
    url = "/api/v1/profile/summary?start=2026-09-01&end=2026-09-26"
    result = test.get(url).json()
    assert result["sessions"] == 1 and result["calories"] == 500 and result["logged_days"] == 1
    assert result["average_calories"] == 500
    with session() as db:
        db.get(DiaryEntry, entry_id).grams = 200
        db.delete(db.get(Workout, plans[0]))
        db.commit()
    result = test.get(url).json()
    assert result["sessions"] == 0 and result["calories"] == 700
    assert test.get("/api/v1/profile/summary?start=2026-09-26&end=2026-09-01").status_code == 422


def test_under_floor_is_blocked_and_get_does_not_write_goals(profile_client):
    profile = SimpleNamespace(sex="female", birth_date=date(1940, 1, 1), height_cm=130,
        activity_level="sedentary", goal="lose", deficit_percent=20, surplus_percent=10,
        target_weight_kg=None, pregnant_or_breastfeeding=False)
    assert not estimate(profile, SimpleNamespace(weight_kg=40, day=TODAY), TODAY)["available"]
    test, session = profile_client
    save_profile(test)
    save_weight(test)
    with session() as db:
        before = len(db.scalars(select(NutritionGoal)).all())
    test.get("/api/v1/profile")
    test.get("/api/v1/profile")
    with session() as db:
        assert len(db.scalars(select(NutritionGoal)).all()) == before


def test_profile_migration_preserves_existing_goals(tmp_path):
    import os
    import subprocess
    import sys
    from pathlib import Path
    from sqlalchemy import create_engine, text

    root = Path(__file__).resolve().parents[1]
    url = f"sqlite:///{tmp_path / 'migration.sqlite'}"
    env = {**os.environ, "DATABASE_URL": url}
    def migrate(revision):
        result = subprocess.run([sys.executable, "-m", "alembic", "upgrade", revision], cwd=root,
                                env=env, capture_output=True, text=True)
        assert result.returncode == 0, result.stderr
    migrate("0005_workout_templates")
    engine = create_engine(url)
    with engine.begin() as conn:
        conn.execute(text("INSERT INTO nutrition_goals (user_id,effective_from,goal_type,calories,protein,notes) "
                          "VALUES ('alice','2026-08-01','maintain',2400,140,'existing')"))
    migrate("head")
    with engine.connect() as conn:
        saved = conn.execute(text("SELECT calories, protein, source, valid_until FROM nutrition_goals")).one()
        assert tuple(saved) == (2400, 140, "manual", None)
        assert conn.execute(text("SELECT count(*) FROM user_profiles")).scalar() == 0
    engine.dispose()
