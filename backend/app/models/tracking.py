from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, Integer, JSON, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Workout(Base):
    __tablename__ = "workouts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(160))
    sport: Mapped[str] = mapped_column(String(80))
    notes: Mapped[str] = mapped_column(String(2000), default="")
    exercises: Mapped[list] = mapped_column(JSON)

class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    workout_id: Mapped[int] = mapped_column(Integer, unique=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    snapshot: Mapped[dict] = mapped_column(JSON)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

class Nutrient(Base):
    __tablename__ = "nutrients"
    key: Mapped[str] = mapped_column(String(60), primary_key=True)
    label: Mapped[str] = mapped_column(String(100))
    unit: Mapped[str] = mapped_column(String(15))

class Food(Base):
    __tablename__ = "foods"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(180), index=True)
    calories: Mapped[float] = mapped_column(Float)
    nutrients: Mapped[dict] = mapped_column(JSON)

class DiaryEntry(Base):
    __tablename__ = "diary_entries"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    meal: Mapped[str] = mapped_column(String(60))
    food_id: Mapped[int] = mapped_column(Integer)
    grams: Mapped[float] = mapped_column(Float)
    snapshot: Mapped[dict] = mapped_column(JSON)

class GoalType(Base):
    __tablename__ = "goal_types"
    key: Mapped[str] = mapped_column(String(60), primary_key=True)
    label: Mapped[str] = mapped_column(String(100))
    description: Mapped[str] = mapped_column(String(500), default="")

class NutritionGoal(Base):
    __tablename__ = "nutrition_goals"
    __table_args__ = (UniqueConstraint("user_id", "effective_from"),)
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    effective_from: Mapped[date] = mapped_column(Date)
    goal_type: Mapped[str] = mapped_column(String(60))
    calories: Mapped[float] = mapped_column(Float)
    protein: Mapped[float] = mapped_column(Float)
    pace_kg_week: Mapped[float | None] = mapped_column(Float, nullable=True)
    notes: Mapped[str] = mapped_column(String(1000), default="")
