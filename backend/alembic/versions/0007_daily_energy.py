"""Daily movement, session energy and normalized workout exercise references."""
from alembic import op
import sqlalchemy as sa

revision = "0007_daily_energy"
down_revision = "0006_user_profile"
branch_labels = depends_on = None


def upgrade():
    for table in ("workouts", "workout_templates"):
        with op.batch_alter_table(table) as batch:
            batch.add_column(sa.Column("sport_type_id", sa.Integer(), nullable=True))
            batch.create_foreign_key(f"fk_{table}_sport", "sport_types", ["sport_type_id"], ["id"])
            batch.add_column(sa.Column("activity_type", sa.String(40), nullable=True))
            batch.add_column(sa.Column("duration_minutes", sa.Float(), nullable=True))
            batch.add_column(sa.Column("intensity", sa.String(20), server_default="moderate", nullable=False))
    op.add_column("workouts", sa.Column("steps_included", sa.Integer(), nullable=True))
    op.add_column("sport_types", sa.Column("activity_type", sa.String(40), nullable=True))
    op.add_column("sport_types", sa.Column("default_duration_minutes", sa.Float(), nullable=True))
    op.add_column("sport_types", sa.Column("default_intensity", sa.String(20), server_default="moderate", nullable=False))
    op.create_table("daily_activity",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), nullable=False),
        sa.Column("day", sa.Date(), nullable=False), sa.Column("steps", sa.Integer(), nullable=True),
        sa.Column("steps_scope", sa.String(30), nullable=False),
        sa.Column("complete", sa.Boolean(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.UniqueConstraint("user_id", "day", name="uq_activity_user_day"))
    op.create_index("ix_daily_activity_user_id", "daily_activity", ["user_id"])
    op.create_index("ix_daily_activity_day", "daily_activity", ["day"])
    op.create_table("workout_exercises",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("workout_id", sa.Integer(), sa.ForeignKey("workouts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("exercise_id", sa.Integer(), sa.ForeignKey("exercise_definitions.id"), nullable=True),
        sa.Column("position", sa.Integer(), nullable=False),
        sa.Column("legacy_name", sa.String(160), nullable=False),
        sa.Column("values", sa.JSON(), nullable=False))
    op.create_index("ix_workout_exercises_workout_id", "workout_exercises", ["workout_id"])
    connection = op.get_bind()
    metadata = sa.MetaData()
    workouts = sa.Table("workouts", metadata, autoload_with=connection)
    definitions = sa.Table("exercise_definitions", metadata, autoload_with=connection)
    target = sa.Table("workout_exercises", metadata, autoload_with=connection)
    known = {r.id: r.user_id for r in connection.execute(sa.select(definitions.c.id, definitions.c.user_id))}
    for plan in connection.execute(sa.select(workouts.c.id, workouts.c.user_id, workouts.c.exercises)).mappings():
        for position, item in enumerate(plan["exercises"] or []):
            exercise_id = item.get("exercise_id")
            if known.get(exercise_id) not in (plan["user_id"], "__system__"):
                exercise_id = None  # Preserve orphan/legacy data as a named legacy observation.
            connection.execute(target.insert().values(workout_id=plan["id"], position=position,
                exercise_id=exercise_id, legacy_name=item.get("name", ""),
                values={k: v for k, v in item.items() if k not in ("name", "exercise_id")}))
    templates = sa.Table("workout_templates", metadata, autoload_with=connection)
    for template in connection.execute(sa.select(templates.c.id, templates.c.user_id, templates.c.exercises)).mappings():
        exercises = [dict(item) for item in (template["exercises"] or [])]
        for item in exercises:
            if item.get("exercise_id") and known.get(item["exercise_id"]) not in (template["user_id"], "__system__"):
                item["exercise_id"] = None
        connection.execute(templates.update().where(templates.c.id == template["id"]).values(exercises=exercises))
    with op.batch_alter_table("workouts") as batch:
        batch.drop_column("exercises")


def downgrade():
    op.add_column("workouts", sa.Column("exercises", sa.JSON(), nullable=True))
    connection = op.get_bind()
    metadata = sa.MetaData()
    workouts = sa.Table("workouts", metadata, autoload_with=connection)
    items = sa.Table("workout_exercises", metadata, autoload_with=connection)
    for (workout_id,) in connection.execute(sa.select(workouts.c.id)):
        rows = connection.execute(sa.select(items).where(items.c.workout_id == workout_id).order_by(items.c.position)).mappings()
        exercises = [dict(r["values"], exercise_id=r["exercise_id"], name=r["legacy_name"]) for r in rows]
        connection.execute(workouts.update().where(workouts.c.id == workout_id).values(exercises=exercises))
    with op.batch_alter_table("workouts") as batch:
        batch.alter_column("exercises", existing_type=sa.JSON(), nullable=False)
    op.drop_table("workout_exercises")
    op.drop_table("daily_activity")
    for table in ("workouts", "workout_templates"):
        with op.batch_alter_table(table) as batch:
            batch.drop_constraint(f"fk_{table}_sport", type_="foreignkey")
            for col in ("sport_type_id", "activity_type", "duration_minutes", "intensity"):
                batch.drop_column(col)
            if table == "workouts": batch.drop_column("steps_included")
    with op.batch_alter_table("sport_types") as batch:
        for col in ("activity_type", "default_duration_minutes", "default_intensity"):
            batch.drop_column(col)
