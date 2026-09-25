from datetime import date

from fastapi import FastAPI
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.models.tracking import SportType, Workout, WorkoutLog
from app.training import progress_router


def test_reports_only_include_authenticated_users_completed_snapshots():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )

    Base.metadata.create_all(engine)

    exercise_id = 17
    workout_day = date(2026, 9, 25)

    with Session(engine) as db:

        for ident, uid, weight in [
            (1, "owner", 62),
            (2, "stranger", 999),
        ]:
            db.add(
                SportType(
                    user_id=uid,
                    name="Sala",
                    is_active=True,
                )
            )

            exercise = {
                "exercise_id": exercise_id,
                "name": "Ramat",
                "sets": 3,
                "reps": 8,
                "weight_kg": weight,
            }

            db.add(
                Workout(
                    id=ident,
                    user_id=uid,
                    day=workout_day,
                    sport="Sala",
                    title=uid,
                    notes="",
                    exercises=[exercise],
                )
            )

            db.add(
                WorkoutLog(
                    workout_id=ident,
                    user_id=uid,
                    day=workout_day,
                    snapshot={
                        "sport": "Sala",
                        "title": uid,
                        "exercises": [exercise],
                    },
                )
            )

        db.commit()

        app = FastAPI()

        app.include_router(
            progress_router.router,
            prefix="/api/v1",
        )

        app.dependency_overrides[progress_router.get_db] = lambda: db
        app.dependency_overrides[progress_router.current_user] = (
            lambda: {"uid": "owner"}
        )

        with TestClient(app) as client:

            params = {
                "sport": "Sala",
                "exercise_key": f"id:{exercise_id}",
                "anchor": "2026-09-25",
                "period": "month",
            }

            result = client.get(
                "/api/v1/training-progress",
                params=params,
            )

            assert result.status_code == 200, result.text

            data = result.json()

            # foarte util momentan:
            print(data)

            assert data["metrics"]["weight_kg"]["current"] == 62
            assert len(data["rows"]) == 1

            catalog = client.get(
                "/api/v1/training-progress/catalog"
            )

            assert catalog.status_code == 200

            assert (
                catalog.json()[0]["exercises"][0]["key"]
                == f"id:{exercise_id}"
            )

            assert client.get(
                "/api/v1/training-progress",
                params={**params, "period": "invalid"},
            ).status_code == 422

            assert client.get(
                "/api/v1/training-progress",
                params={**params, "anchor": "2026-02-30"},
            ).status_code == 422

    engine.dispose()