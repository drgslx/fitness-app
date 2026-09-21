from datetime import date
from sqlalchemy import Date, Float, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base


class Recipe(Base):
    __tablename__ = "recipes"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(180), index=True)
    servings: Mapped[float] = mapped_column(Float)
    cooked_total_grams: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str] = mapped_column(String(1000), default="")


class RecipeIngredient(Base):
    __tablename__ = "recipe_ingredients"
    id: Mapped[int] = mapped_column(primary_key=True)
    recipe_id: Mapped[int] = mapped_column(Integer, index=True)
    food_id: Mapped[int] = mapped_column(Integer)
    name: Mapped[str] = mapped_column(String(180))
    snapshot: Mapped[dict] = mapped_column(JSON)
    grams: Mapped[float] = mapped_column(Float)


class RecipeDiaryEntry(Base):
    __tablename__ = "recipe_diary_entries"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    recipe_id: Mapped[int] = mapped_column(Integer)
    day: Mapped[date] = mapped_column(Date, index=True)
    meal: Mapped[str] = mapped_column(String(60))
    grams: Mapped[float] = mapped_column(Float)
    servings: Mapped[float | None] = mapped_column(Float, nullable=True)
    quantity_unit: Mapped[str] = mapped_column(String(12))
    snapshot: Mapped[dict] = mapped_column(JSON)
