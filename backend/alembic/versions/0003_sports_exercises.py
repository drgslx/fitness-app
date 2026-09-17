"""Personal sport and exercise catalogs."""

from alembic import op
import sqlalchemy as sa


revision = "0003_sports_exercises"
down_revision = "0002_tracking"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "sport_types",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
        sa.UniqueConstraint(
            "user_id",
            "name",
            name="uq_sport_type_user_name",
        ),
    )

    op.create_index(
        "ix_sport_types_user_id",
        "sport_types",
        ["user_id"],
    )

    op.create_table(
        "exercise_definitions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), nullable=False),
        sa.Column(
            "sport_type_id",
            sa.Integer(),
            sa.ForeignKey("sport_types.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("name", sa.String(160), nullable=False),
        sa.Column("tracking_type", sa.String(30), nullable=False),
        sa.Column(
            "is_active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),
        sa.UniqueConstraint(
            "sport_type_id",
            "name",
            name="uq_exercise_sport_name",
        ),
    )

    op.create_index(
        "ix_exercise_definitions_user_id",
        "exercise_definitions",
        ["user_id"],
    )

    op.create_index(
        "ix_exercise_definitions_sport_type_id",
        "exercise_definitions",
        ["sport_type_id"],
    )


def downgrade():
    op.drop_table("exercise_definitions")
    op.drop_table("sport_types")