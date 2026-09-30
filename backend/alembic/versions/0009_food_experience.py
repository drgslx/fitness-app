"""Food favorites and persistent local moderation."""
from alembic import op
import sqlalchemy as sa

revision = "0009_food_experience"
down_revision = "0008_food_catalog"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("foods", sa.Column("archived", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.create_table("food_favorites",
        sa.Column("user_id", sa.String(128), primary_key=True),
        sa.Column("food_id", sa.Integer(), sa.ForeignKey("foods.id"), primary_key=True))
    op.create_table("food_exclusions",
        sa.Column("barcode", sa.String(14), primary_key=True),
        sa.Column("created_by", sa.String(128), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()))


def downgrade():
    op.drop_table("food_favorites")
    op.drop_table("food_exclusions")
    op.drop_column("foods", "archived")
