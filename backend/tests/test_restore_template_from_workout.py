"""Run from backend/: pytest -q tests/test_restore_template_from_workout.py"""
from copy import deepcopy
from datetime import date

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models.tracking import Workout, WorkoutLog, WorkoutTemplate
from app.training import sessions_router


def test_editing_workout_creates_independent_template_and_preserves_history():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        original = [{"exercise_id": 46, "name": "Ramat vertical", "sets": 2,
                     "reps": 8, "weight_kg": 70, "minutes": None, "notes": ""},
                    {"exercise_id": 46, "name": "Ramat vertical", "sets": 1,
                     "reps": 8, "weight_kg": 20, "minutes": None, "notes": ""}]
        workout = Workout(user_id="owner", day=date(2026, 9, 23),
                          title="Upper body", sport="Sala", notes="",
                          exercises=deepcopy(original))
        db.add(workout)
        db.commit()
        db.refresh(workout)
        log = WorkoutLog(workout_id=workout.id, user_id="owner",
                         day=workout.day, snapshot={"exercises": deepcopy(original)})
        db.add(log)
        db.commit()
        workout_id = workout.id
        log_id = log.id

        app = FastAPI()
        app.include_router(sessions_router.router, prefix="/api/v1")
        app.dependency_overrides[sessions_router.current_user] = lambda: {"uid": "owner"}
        app.dependency_overrides[sessions_router.get_db] = lambda: db
        updated = deepcopy(original)
        updated[0]["weight_kg"] = 80
        body = {"day": "2026-09-23", "title": "Upper body", "sport": "Sala",
                "notes": "", "exercises": updated, "save_as_template": True,
                "template_name": "Upper body v2"}
        with TestClient(app) as client:
            result = client.put(f"/api/v1/workouts/{workout_id}", json=body)
            assert result.status_code == 200, result.text
            assert len(db.scalars(select(WorkoutTemplate)).all()) == 1
            template = db.scalar(select(WorkoutTemplate))
            assert template.user_id == "owner"
            assert template.name == "Upper body v2"
            assert template.exercises == updated
            assert template.exercises[0]["weight_kg"] == 80
            assert len(template.exercises) == 2  # keep repeated exercise IDs
            db.expire_all()
            assert db.get(WorkoutLog, log_id).snapshot["exercises"] == original

            body["save_as_template"] = False
            body["exercises"] = deepcopy(updated)
            body["exercises"][0]["weight_kg"] = 90
            result = client.put(f"/api/v1/workouts/{workout_id}", json=body)
            assert result.status_code == 200, result.text
            db.expire_all()
            assert len(db.scalars(select(WorkoutTemplate)).all()) == 1
            assert db.get(WorkoutTemplate, template.id).exercises == updated
            assert db.get(WorkoutLog, log_id).snapshot["exercises"] == original

            app.dependency_overrides[sessions_router.current_user] = lambda: {"uid": "stranger"}
            result = client.put(f"/api/v1/workouts/{workout_id}", json={**body, "save_as_template": True})
            assert result.status_code == 404
            assert len(db.scalars(select(WorkoutTemplate)).all()) == 1
    engine.dispose()
