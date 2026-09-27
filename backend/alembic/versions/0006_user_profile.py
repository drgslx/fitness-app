"""User profiles, dated body weights and provenance of calorie targets."""
from alembic import op
import sqlalchemy as sa

revision = "0006_user_profile"
down_revision = "0005_workout_templates"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "user_profiles",
        sa.Column("user_id", sa.String(128), primary_key=True),
        sa.Column("sex", sa.String(10), nullable=False),
        sa.Column("birth_date", sa.Date(), nullable=False),
        sa.Column("height_cm", sa.Float(), nullable=False),
        sa.Column("activity_level", sa.String(20), nullable=False),
        sa.Column("goal", sa.String(10), nullable=False),
        sa.Column("timezone", sa.String(64), nullable=False, server_default="Europe/Bucharest"),
        sa.Column("deficit_percent", sa.Integer(), nullable=False, server_default="10"),
        sa.Column("surplus_percent", sa.Integer(), nullable=False, server_default="10"),
        sa.Column("target_weight_kg", sa.Float(), nullable=True),
        sa.Column("pregnant_or_breastfeeding", sa.Boolean(), nullable=False, server_default=sa.false()),
        sa.Column("auto_calories", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
    )
    op.create_table(
        "body_weights",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), sa.ForeignKey("user_profiles.user_id", ondelete="CASCADE"), nullable=False),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("weight_kg", sa.Float(), nullable=False),
        sa.UniqueConstraint("user_id", "day", name="uq_body_weight_user_day"),
    )
    op.create_index("ix_body_weights_user_id", "body_weights", ["user_id"])
    op.add_column("nutrition_goals", sa.Column("source", sa.String(20), nullable=False, server_default="manual"))
    op.add_column("nutrition_goals", sa.Column("calculation", sa.JSON(), nullable=True))
    op.add_column("nutrition_goals", sa.Column("valid_until", sa.Date(), nullable=True))


def downgrade():
    op.drop_column("nutrition_goals", "valid_until")
    op.drop_column("nutrition_goals", "calculation")
    op.drop_column("nutrition_goals", "source")
    op.drop_index("ix_body_weights_user_id", table_name="body_weights")
    op.drop_table("body_weights")
    op.drop_table("user_profiles")
