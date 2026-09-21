"""Personal recipes and recipe diary entries."""
from alembic import op
import sqlalchemy as sa

revision = "0004_recipes"
down_revision = "0003_sports_exercises"
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "recipes",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), nullable=False),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("servings", sa.Float(), nullable=False),
        sa.Column("cooked_total_grams", sa.Float(), nullable=True),
        sa.Column("notes", sa.String(1000), nullable=False),
    )
    op.create_index("ix_recipes_user_id", "recipes", ["user_id"])
    op.create_index("ix_recipes_name", "recipes", ["name"])
    op.create_table(
        "recipe_ingredients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("recipe_id", sa.Integer(), nullable=False),
        sa.Column("food_id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(180), nullable=False),
        sa.Column("snapshot", sa.JSON(), nullable=False),
        sa.Column("grams", sa.Float(), nullable=False),
    )
    op.create_index("ix_recipe_ingredients_recipe_id", "recipe_ingredients", ["recipe_id"])
    op.create_table(
        "recipe_diary_entries",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.String(128), nullable=False),
        sa.Column("recipe_id", sa.Integer(), nullable=False),
        sa.Column("day", sa.Date(), nullable=False),
        sa.Column("meal", sa.String(60), nullable=False),
        sa.Column("grams", sa.Float(), nullable=False),
        sa.Column("servings", sa.Float(), nullable=True),
        sa.Column("quantity_unit", sa.String(12), nullable=False),
        sa.Column("snapshot", sa.JSON(), nullable=False),
    )
    op.create_index("ix_recipe_diary_entries_user_id", "recipe_diary_entries", ["user_id"])
    op.create_index("ix_recipe_diary_entries_day", "recipe_diary_entries", ["day"])


def downgrade():
    op.drop_table("recipe_diary_entries")
    op.drop_table("recipe_ingredients")
    op.drop_table("recipes")
