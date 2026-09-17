"""Training, food catalog, diary snapshots and configurable goals."""
from alembic import op
import sqlalchemy as sa
revision = "0002_tracking"
down_revision = "0001_articles"
branch_labels = None
depends_on = None

def identity():
    return [sa.Column("id", sa.Integer(), primary_key=True),
            sa.Column("user_id", sa.String(128), nullable=False)]

def upgrade():
    op.create_table("workouts", *identity(),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("title", sa.String(160), nullable=False),
        sa.Column("sport", sa.String(80), nullable=False),
        sa.Column("notes", sa.String(2000), nullable=False),
        sa.Column("exercises", sa.JSON(), nullable=False))
    op.create_table("workout_logs", *identity(),
        sa.Column("workout_id", sa.Integer(), unique=True, nullable=False),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("snapshot", sa.JSON(), nullable=False),
        sa.Column("completed_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))
    op.create_table("nutrients",
        sa.Column("key", sa.String(60), primary_key=True),
        sa.Column("label", sa.String(100), nullable=False),
        sa.Column("unit", sa.String(15), nullable=False))
    op.create_table("foods", *identity(),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("calories", sa.Float(), nullable=False),
        sa.Column("nutrients", sa.JSON(), nullable=False))
    op.create_table("diary_entries", *identity(),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("meal", sa.String(60), nullable=False),
        sa.Column("food_id", sa.Integer(), nullable=False),
        sa.Column("grams", sa.Float(), nullable=False),
        sa.Column("snapshot", sa.JSON(), nullable=False))
    op.create_table("goal_types",
        sa.Column("key", sa.String(60), primary_key=True),
        sa.Column("label", sa.String(100), nullable=False),
        sa.Column("description", sa.String(500), nullable=False))
    op.create_table("nutrition_goals", *identity(),
        sa.Column("effective_from", sa.Date(), nullable=False),
        sa.Column("goal_type", sa.String(60), nullable=False),
        sa.Column("calories", sa.Float(), nullable=False),
        sa.Column("protein", sa.Float(), nullable=False),
        sa.Column("pace_kg_week", sa.Float(), nullable=True),
        sa.Column("notes", sa.String(1000), nullable=False),
        sa.UniqueConstraint("user_id", "effective_from"))
    for table in ["workouts", "workout_logs", "foods", "diary_entries", "nutrition_goals"]:
        op.create_index("ix_" + table + "_user_id", table, ["user_id"])
    for table in ["workouts", "workout_logs", "diary_entries"]:
        op.create_index("ix_" + table + "_day", table, ["day"])
    op.create_index("ix_foods_name", "foods", ["name"])
    nutrients = sa.table("nutrients", sa.column("key", sa.String), sa.column("label", sa.String), sa.column("unit", sa.String))
    op.bulk_insert(nutrients, [
        {"key": key, "label": label, "unit": "g"} for key, label in [
            ("carbohydrates", "Carbohidrați"), ("protein", "Proteine"), ("fat", "Grăsimi"),
            ("salt", "Sare"), ("saturated_fat", "Grăsimi saturate"), ("unsaturated_fat", "Grăsimi nesaturate")]])
    types = sa.table("goal_types", sa.column("key", sa.String), sa.column("label", sa.String), sa.column("description", sa.String))
    op.bulk_insert(types, [
        {"key": "lose", "label": "Slăbire", "description": "Ținte stabilite de utilizator"},
        {"key": "maintain", "label": "Menținere", "description": "Ținte stabilite de utilizator"},
        {"key": "gain", "label": "Masă musculară", "description": "Ținte stabilite de utilizator"}])

def downgrade():
    for table in ["nutrition_goals", "goal_types", "diary_entries", "foods", "nutrients", "workout_logs", "workouts"]:
        op.drop_table(table)
