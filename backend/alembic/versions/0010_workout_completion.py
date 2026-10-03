"""Record duration and intensity only for completed sessions."""
from alembic import op
import sqlalchemy as sa

revision = "0010_workout_completion"
down_revision = "0009_food_experience"
branch_labels = depends_on = None


def upgrade():
    with op.batch_alter_table("workouts") as batch:
        batch.alter_column("intensity", existing_type=sa.String(20),
                           nullable=True, server_default=None)
    connection = op.get_bind()
    metadata = sa.MetaData()
    workouts = sa.Table("workouts", metadata, autoload_with=connection)
    logs = sa.Table("workout_logs", metadata, autoload_with=connection)
    completed = sa.exists().where(
        logs.c.workout_id == workouts.c.id, logs.c.user_id == workouts.c.user_id)
    connection.execute(workouts.update().where(~completed).values(
        duration_minutes=None, intensity=None))
    # Preserve existing completed sessions and expose their measurements in history.
    for record in connection.execute(sa.select(workouts, logs.c.id.label("log_id"), logs.c.snapshot)
                                     .join(logs, sa.and_(logs.c.workout_id == workouts.c.id,
                                                        logs.c.user_id == workouts.c.user_id))).mappings():
        snapshot = dict(record["snapshot"] or {})
        for key in ("activity_type", "duration_minutes", "intensity", "steps_included"):
            snapshot[key] = record[key]
        connection.execute(logs.update().where(logs.c.id == record["log_id"]).values(snapshot=snapshot))
    with op.batch_alter_table("workout_templates") as batch:
        batch.drop_column("duration_minutes")
        batch.drop_column("intensity")


def downgrade():
    with op.batch_alter_table("workout_templates") as batch:
        batch.add_column(sa.Column("duration_minutes", sa.Float(), nullable=True))
        batch.add_column(sa.Column("intensity", sa.String(20), nullable=False, server_default="moderate"))
    workouts = sa.table("workouts", sa.column("intensity", sa.String(20)))
    op.get_bind().execute(workouts.update().where(workouts.c.intensity.is_(None)).values(intensity="moderate"))
    with op.batch_alter_table("workouts") as batch:
        batch.alter_column("intensity", existing_type=sa.String(20),
                           nullable=False, server_default="moderate")
