from copy import deepcopy
from datetime import date

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models.tracking import Workout, WorkoutTemplate, WorkoutLog
from app.training import template_actions_router as routes


@pytest.fixture
def client_and_db():
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        app = FastAPI()
        app.include_router(routes.router, prefix="/api/v1")
        app.dependency_overrides[routes.current_user] = lambda: {"uid": "owner"}
        app.dependency_overrides[routes.get_db] = lambda: db
        with TestClient(app) as client:
            yield client, db
    engine.dispose()


def make_template(db, user_id="owner", is_active=True):
    exercises = [
        {"exercise_id": None, "name": f"Exercise {i}", "sets": 3, "reps": 8,
         "minutes": None, "weight_kg": 60.0, "notes": "control"}
        for i in range(4)
    ]
    exercises[0]["weight_kg"] = 70.0
    exercises += [
        {"exercise_id": 46, "name": "Ramat vertical", "sets": 2, "reps": 8,
         "minutes": None, "weight_kg": 40.0, "notes": ""},
        {"exercise_id": 46, "name": "Ramat vertical", "sets": 1, "reps": None,
         "minutes": None, "weight_kg": 20.0, "notes": ""},
    ]
    template = WorkoutTemplate(user_id=user_id, name="Upper Body", sport="Sala",
                               notes="Incalzire", exercises=exercises, is_active=is_active)
    db.add(template)
    db.commit()
    db.refresh(template)
    return template


def test_copy_all_exercises_and_isolate_edits(client_and_db):
    client, db = client_and_db
    template = make_template(db)
    original = deepcopy(template.exercises)
    result = client.post(f"/api/v1/workout-templates/{template.id}/sessions", json={"day": "2026-09-25"})
    assert result.status_code == 201
    created = result.json()
    assert created["exercises"] == original
    assert created["day"] == "2026-09-25"
    assert created["title"] == template.name
    assert created["notes"] == template.notes
    assert db.scalars(select(WorkoutLog)).all() == []
    log = WorkoutLog(workout_id=created["id"], user_id="owner", day=date(2026, 9, 25),
                     snapshot={"title": created["title"], "sport": created["sport"],
                               "notes": created["notes"], "exercises": deepcopy(original)})
    db.add(log)
    db.commit()
    revised = deepcopy(original)
    revised[0]["weight_kg"] = 80.0
    updated = client.put(f"/api/v1/workout-templates/{template.id}", json={
        "name": "Upper Body +2", "sport": "Sala", "notes": "New", "exercises": revised,
    })
    assert updated.status_code == 200
    db.expire_all()
    assert db.get(Workout, created["id"]).exercises == original
    assert db.get(WorkoutLog, log.id).snapshot["exercises"] == original
    second = client.post(f"/api/v1/workout-templates/{template.id}/sessions", json={"day": "2026-10-01"})
    assert second.status_code == 201
    assert second.json()["exercises"] == revised
    # Editing a one-off workout must not mutate its template.
    session = db.get(Workout, second.json()["id"])
    changed = deepcopy(session.exercises)
    changed[0]["weight_kg"] = 10
    session.exercises = changed
    db.commit()
    db.expire_all()
    assert db.get(WorkoutTemplate, template.id).exercises == revised
    # Existing deletion flow archives templates; existing workouts survive.
    db.get(WorkoutTemplate, template.id).is_active = False
    db.commit()
    assert db.get(Workout, created["id"]) is not None
    assert client.post(f"/api/v1/workout-templates/{template.id}/sessions", json={"day": "2026-10-02"}).status_code == 404


def test_other_users_cannot_read_edit_or_copy(client_and_db):
    client, db = client_and_db
    template = make_template(db, user_id="someone-else")
    url = f"/api/v1/workout-templates/{template.id}"
    assert client.get(url).status_code == 404
    assert client.put(url, json={"name": "No", "sport": "Sala", "notes": "", "exercises": []}).status_code == 404
    assert client.post(url + "/sessions", json={"day": "2026-09-25"}).status_code == 404
    assert db.scalars(select(Workout)).all() == []


def test_invalid_day_is_rejected(client_and_db):
    client, db = client_and_db
    template = make_template(db)
    for payload in [{}, {"day": "2026-02-30"}, {"day": "2026-09-25", "user_id": "someone-else"}]:
        assert client.post(f"/api/v1/workout-templates/{template.id}/sessions", json=payload).status_code == 422
    assert db.scalars(select(Workout)).all() == []


def test_empty_aerobic_template_can_be_copied(client_and_db):
    client, db = client_and_db
    template = make_template(db)
    template.exercises = []
    template.sport = "Aerobic"
    db.commit()
    result = client.post(f"/api/v1/workout-templates/{template.id}/sessions", json={"day": "2026-09-25"})
    assert result.status_code == 201
    assert result.json()["exercises"] == []
