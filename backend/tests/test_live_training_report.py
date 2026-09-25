from datetime import date

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.db.base import Base
from app.models.tracking import SportType, Workout, WorkoutLog
from app.training.progress_router import active_completed_logs
from app.training.progress_service import build_report, catalog


def test_report_uses_current_completed_sessions_and_active_sports():
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    with Session(engine) as db:
        active = SportType(user_id="me", name="Sala", is_active=True)
        archived = SportType(user_id="me", name="Vechi", is_active=False)
        db.add_all([active, archived])
        db.flush()
        current = Workout(user_id="me", day=date(2026, 9, 25), title="A",
                          sport="Sala", notes="", exercises=[{"exercise_id": 1, "name": "Ramat",
                          "sets": 3, "reps": 8, "weight_kg": 60}])
        old = Workout(user_id="me", day=date(2026, 9, 25), title="B",
                      sport="Vechi", notes="", exercises=[{"exercise_id": 2, "name": "Vechi"}])
        planned = Workout(user_id="me", day=date(2026, 9, 25), title="C",
                          sport="Sala", notes="", exercises=[{"exercise_id": 3, "name": "Neexecutat"}])
        db.add_all([current, old, planned])
        db.flush()
        db.add_all([WorkoutLog(workout_id=plan.id, user_id="me", day=plan.day,
                               snapshot={"sport": plan.sport, "title": plan.title,
                                         "exercises": plan.exercises}) for plan in (current, old)])
        db.commit()

        current.exercises = [{"exercise_id": 1, "name": "Ramat", "sets": 4,
                              "reps": 10, "weight_kg": 65}]
        current.day = date(2026, 9, 26)
        db.commit()
        logs = active_completed_logs(db, "me")
        assert [item["name"] for item in catalog(logs)] == ["Sala"]
        report = build_report(logs, "Sala", "id:1", date(2026, 9, 26), "month")
        assert report["points"][25]["repetitions"] == 40
        assert report["points"][25]["weight_kg"] == 65
        assert report["points"][24]["weight_kg"] is None

        db.delete(current)
        db.commit()
        assert active_completed_logs(db, "me") == []
