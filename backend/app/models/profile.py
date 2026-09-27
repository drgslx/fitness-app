from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class UserProfile(Base):
    __tablename__ = "user_profiles"

    # Firebase owns authentication; Postgres owns application data.
    user_id: Mapped[str] = mapped_column(String(128), primary_key=True)
    sex: Mapped[str] = mapped_column(String(10))
    birth_date: Mapped[date] = mapped_column(Date)
    height_cm: Mapped[float] = mapped_column(Float)
    activity_level: Mapped[str] = mapped_column(String(20))
    goal: Mapped[str] = mapped_column(String(10))
    timezone: Mapped[str] = mapped_column(String(64), default="Europe/Bucharest")
    deficit_percent: Mapped[int] = mapped_column(default=10)
    surplus_percent: Mapped[int] = mapped_column(default=10)
    target_weight_kg: Mapped[float | None] = mapped_column(Float, nullable=True)
    pregnant_or_breastfeeding: Mapped[bool] = mapped_column(Boolean, default=False)
    auto_calories: Mapped[bool] = mapped_column(Boolean, default=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class BodyWeight(Base):
    __tablename__ = "body_weights"
    __table_args__ = (UniqueConstraint("user_id", "day", name="uq_body_weight_user_day"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("user_profiles.user_id", ondelete="CASCADE"), index=True)
    day: Mapped[date] = mapped_column(Date)
    weight_kg: Mapped[float] = mapped_column(Float)
