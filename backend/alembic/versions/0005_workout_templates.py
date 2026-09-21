"""Add reusable workout templates."""

from alembic import op
import sqlalchemy as sa

revision = "0005_workout_templates"
down_revision = "0004_recipes"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "workout_templates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=160), nullable=False),
        sa.Column("sport", sa.String(length=80), nullable=False),
        sa.Column("notes", sa.String(length=2000), nullable=False, server_default=""),
        sa.Column("exercises", sa.JSON(), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
    )

    op.create_index(
        "ix_workout_templates_user_id",
        "workout_templates",
        ["user_id"],
    )


def downgrade():
    op.drop_index("ix_workout_templates_user_id", table_name="workout_templates")
    op.drop_table("workout_templates")