from datetime import date
from typing import Literal
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProfileIn(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    sex: Literal["female", "male"]
    birth_date: date
    height_cm: float = Field(ge=100, le=250)
    activity_level: Literal["sedentary", "light", "moderate", "high", "very_high"]
    goal: Literal["lose", "maintain", "gain"]
    timezone: str = Field(default="Europe/Bucharest", max_length=64)
    deficit_percent: Literal[10, 15, 20] = 10
    surplus_percent: Literal[5, 10, 15, 20] = 10
    target_weight_kg: float | None = Field(default=None, ge=25, le=400)
    pregnant_or_breastfeeding: bool = False
    auto_calories: bool = True

    @field_validator("timezone")
    @classmethod
    def valid_timezone(cls, value):
        try:
            ZoneInfo(value)
        except (ZoneInfoNotFoundError, ValueError):
            raise ValueError("Fus orar invalid.")
        return value

    @field_validator("birth_date")
    @classmethod
    def valid_birth_date(cls, value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if value > today or age > 120:
            raise ValueError("Data nasterii nu este valida.")
        return value


class WeightIn(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

    day: date
    weight_kg: float = Field(ge=25, le=400)
