import json
import os
from pathlib import Path
import subprocess
import sys

from sqlalchemy import create_engine, inspect, text


def test_completion_migration_preserves_completed_sessions_and_clears_plans(tmp_path):
    url = f"sqlite:///{tmp_path / 'completion.sqlite'}"
    root = Path(__file__).resolve().parents[1]

    def migrate(direction, revision):
        result = subprocess.run([sys.executable, "-m", "alembic", direction, revision],
                                cwd=root, env={**os.environ, "DATABASE_URL": url},
                                capture_output=True, text=True)
        assert result.returncode == 0, result.stderr

    migrate("upgrade", "0009_food_experience")
    engine = create_engine(url)
    with engine.begin() as connection:
        connection.execute(text("""
            INSERT INTO workouts (id,user_id,day,title,sport,notes,activity_type,duration_minutes,intensity)
            VALUES (1,'alice','2026-09-25','Planned','Sala','','strength',45,'high'),
                   (2,'alice','2026-09-26','Completed','Sala','','strength',60,'high'),
                   (3,'alice','2026-09-26','Legacy','Sala','','strength',NULL,'moderate')
        """))
        for ident in (2, 3):
            connection.execute(text("""
                INSERT INTO workout_logs (workout_id,user_id,day,snapshot)
                VALUES (:id,'alice','2026-09-26',:snapshot)
            """), {"id": ident, "snapshot": json.dumps({"title": "Keep", "exercises": [{"name": "Squat", "sets": 3}]})})
        connection.execute(text("""
            INSERT INTO workout_templates (user_id,name,sport,notes,exercises,is_active,duration_minutes,intensity)
            VALUES ('alice','Template','Sala','Keep','[]',1,90,'very_high')
        """))
    migrate("upgrade", "head")
    with engine.connect() as connection:
        assert connection.execute(text("SELECT duration_minutes,intensity FROM workouts WHERE id=1")).one() == (None, None)
        assert connection.execute(text("SELECT duration_minutes,intensity FROM workouts WHERE id=2")).one() == (60, "high")
        assert connection.execute(text("SELECT duration_minutes FROM workouts WHERE id=3")).scalar() is None
        snapshot = json.loads(connection.execute(text("SELECT snapshot FROM workout_logs WHERE workout_id=2")).scalar())
        assert snapshot["duration_minutes"] == 60 and snapshot["intensity"] == "high"
        assert snapshot["exercises"] == [{"name": "Squat", "sets": 3}]
        assert connection.execute(text("SELECT name,notes FROM workout_templates")).one() == ("Template", "Keep")
        columns = {column["name"] for column in inspect(connection).get_columns("workout_templates")}
        assert "duration_minutes" not in columns and "intensity" not in columns
    migrate("downgrade", "0009_food_experience")
    migrate("upgrade", "head")
    with engine.connect() as connection:
        assert connection.execute(text("SELECT COUNT(*) FROM workout_logs")).scalar() == 2
        assert connection.execute(text("SELECT duration_minutes,intensity FROM workouts WHERE id=2")).one() == (60, "high")
    engine.dispose()
