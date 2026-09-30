from datetime import date, datetime
from sqlalchemy import Date, DateTime, Float, Integer, JSON, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from sqlalchemy import (
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    UniqueConstraint,
    func,
)

class SportType(Base):
    __tablename__ = "sport_types"
    __table_args__ = (
        UniqueConstraint("user_id", "name", name="uq_sport_type_user_name"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(100))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    activity_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    default_duration_minutes: Mapped[float | None] = mapped_column(Float, nullable=True)
    default_intensity: Mapped[str] = mapped_column(String(20), default="moderate", server_default="moderate")


class ExerciseDefinition(Base):
    __tablename__ = "exercise_definitions"
    __table_args__ = (
        UniqueConstraint(
            "sport_type_id",
            "name",
            name="uq_exercise_sport_name",
        ),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    sport_type_id: Mapped[int] = mapped_column(
        ForeignKey("sport_types.id", ondelete="CASCADE"),
        index=True,
    )
    name: Mapped[str] = mapped_column(String(160))
    tracking_type: Mapped[str] = mapped_column(String(30))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class Workout(Base):
    __tablename__ = "workouts"
    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    title: Mapped[str] = mapped_column(String(160))
    sport: Mapped[str] = mapped_column(String(80))
    notes: Mapped[str] = mapped_column(String(2000), default="")
    sport_type_id: Mapped[int | None] = mapped_column(ForeignKey("sport_types.id"), nullable=True)
    activity_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    duration_minutes: Mapped[float | None] = mapped_column(Float, nullable=True)
    intensity: Mapped[str] = mapped_column(String(20), default="moderate", server_default="moderate")
    steps_included: Mapped[int | None] = mapped_column(Integer, nullable=True)
    exercise_rows: Mapped[list["WorkoutExercise"]] = relationship(
        cascade="all, delete-orphan", order_by="WorkoutExercise.position", lazy="selectin")

    @property
    def exercises(self):
        # API compatibility; performance belongs to a session, identity to the library.
        return [dict(item.values, exercise_id=item.exercise_id,
                     name=item.definition.name if item.definition else item.legacy_name) for item in self.exercise_rows]

    @exercises.setter
    def exercises(self, values):
        self.exercise_rows = [WorkoutExercise(position=i, exercise_id=value.get("exercise_id"),
            legacy_name=value.get("name", ""),
            values={k: v for k, v in value.items() if k not in ("exercise_id", "name")})
            for i, value in enumerate(values or [])]


class WorkoutExercise(Base):
    __tablename__ = "workout_exercises"
    id: Mapped[int] = mapped_column(primary_key=True)
    workout_id: Mapped[int] = mapped_column(ForeignKey("workouts.id", ondelete="CASCADE"), index=True)
    exercise_id: Mapped[int | None] = mapped_column(ForeignKey("exercise_definitions.id"), nullable=True)
    position: Mapped[int] = mapped_column(Integer)
    legacy_name: Mapped[str] = mapped_column(String(160), default="")
    values: Mapped[dict] = mapped_column(JSON)
    definition: Mapped["ExerciseDefinition | None"] = relationship(lazy="joined")


class WorkoutLog(Base):
    __tablename__ = "workout_logs"
    id: Mapped[int] = mapped_column(primary_key=True)
    workout_id: Mapped[int] = mapped_column(Integer, unique=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    day: Mapped[date] = mapped_column(Date, index=True)
    snapshot: Mapped[dict] = mapped_column(JSON)
    completed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    
class WorkoutTemplate(Base):
    __tablename__ = "workout_templates"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(String(128), index=True)
    name: Mapped[str] = mapped_column(String(160))
    sport: Mapped[str] = mapped_column(String(80))
    notes: Mapped[str] = mapped_column(String(2000), default="")
    exercises: Mapped[list] = mapped_column(JSON)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    sport_type_id: Mapped[int | None] = mapped_column(ForeignKey("sport_types.id"), nullable=True)
    activity_type: Mapped[str | None] = mapped_column(String(40), nullable=True)
    duration_minutes: Mapped[float | None] = mapped_column(Float, nullable=True)
    intensity: Mapped[str] = mapped_column(String(20), default="moderate", server_default="moderate")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

class Nutrient(Base):
    __tablename__ = "nutrients"
    key: Mapped[str] = mapped_column(String(60), primary_key=True)
    label: Mapped[str] = mapped_column(String(100))
    unit: Mapped[str] = mapped_column(String(15))

class FoodSearchCache(Base):
    __tablename__ = "food_search_cache"
    key: Mapped[str] = mapped_column(String(64), primary_key=True)
    expires: Mapped[float] = mapped_column(Float)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)


class Food(Base):
    __tablename__ = "foods"
    barcode: Mapped[str | None] = mapped_column(String(14), index=True)
    off_code: Mapped[str | None] = mapped_column(String(14), unique=True)
    is_public: Mapped[bool] = mapped_column(Boolean, default=False, server_default="false")
    source: Mapped[str] = mapped_column(String(20), default="manual", server_default="manual")
    catalog_data: Mapped[dict] = mapped_column(JSON, default=dict, server_default="{}")
    search_text: Mapped[str] = mapped_column(String(1000), default="", server_default="")
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
    source: Mapped[str] = mapped_column(String(20), default="manual", server_default="manual")
    calculation: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    valid_until: Mapped[date | None] = mapped_column(Date, nullable=True)
