"""Local food catalog, OFF provenance and persistent request cache."""
from alembic import op
import sqlalchemy as sa
import unicodedata
revision = "0008_food_catalog"
down_revision = "0007_daily_energy"
branch_labels = depends_on = None

def upgrade():
    op.add_column("foods", sa.Column("barcode", sa.String(14), nullable=True))
    op.add_column("foods", sa.Column("off_code", sa.String(14), nullable=True))
    op.add_column("foods", sa.Column("is_public", sa.Boolean(), nullable=False, server_default=sa.false()))
    op.add_column("foods", sa.Column("source", sa.String(20), nullable=False, server_default="manual"))
    op.add_column("foods", sa.Column("catalog_data", sa.JSON(), nullable=False, server_default="{}"))
    op.add_column("foods", sa.Column("search_text", sa.String(1000), nullable=False, server_default=""))
    # Preserve visibility of the pre-existing shared catalog. No rows are deleted.
    op.execute("UPDATE foods SET is_public = true, source = 'legacy', search_text = lower(name)")
    connection = op.get_bind()
    for item in connection.execute(sa.text("SELECT id, name FROM foods")):
        value = " ".join("".join(c for c in unicodedata.normalize("NFKD", item.name.lower()) if not unicodedata.combining(c)).split())
        connection.execute(sa.text("UPDATE foods SET search_text=:value WHERE id=:id"), {"id":item.id, "value":value})
    op.create_index("ix_foods_barcode", "foods", ["barcode"])
    op.create_index("uq_foods_off_code", "foods", ["off_code"], unique=True)
    op.create_table("food_search_cache", sa.Column("key", sa.String(64), primary_key=True), sa.Column("expires", sa.Float(), nullable=False), sa.Column("payload", sa.JSON(), nullable=False))
    op.bulk_insert(sa.table("food_search_cache", sa.column("key"), sa.column("expires"), sa.column("payload", sa.JSON())), [{"key": "rate", "expires": 0, "payload": {}}])
    if op.get_bind().dialect.name == "postgresql":
        op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")
        op.execute("CREATE INDEX ix_foods_search_trgm ON foods USING gin (search_text gin_trgm_ops)")

def downgrade():
    if op.get_bind().dialect.name == "postgresql": op.execute("DROP INDEX IF EXISTS ix_foods_search_trgm")
    op.drop_table("food_search_cache")
    op.drop_index("uq_foods_off_code", table_name="foods")
    op.drop_index("ix_foods_barcode", table_name="foods")
    for name in ["search_text", "catalog_data", "source", "is_public", "off_code", "barcode"]: op.drop_column("foods", name)
