"""create articles and article images"""
from alembic import op
import sqlalchemy as sa

revision = "0001_articles"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table("articles",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(180), nullable=False),
        sa.Column("slug", sa.String(200), nullable=False, unique=True),
        sa.Column("summary", sa.String(500), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("published", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False))
    op.create_table("article_images",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("article_id", sa.Integer(), sa.ForeignKey("articles.id", ondelete="CASCADE"), nullable=False),
        sa.Column("url", sa.String(500), nullable=False),
        sa.Column("alt_text", sa.String(180), nullable=False),
        sa.Column("position", sa.Integer(), nullable=False, server_default="0"))

def downgrade():
    op.drop_table("article_images")
    op.drop_table("articles")

