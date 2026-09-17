from datetime import date
from typing import Annotated
from pydantic import BaseModel, ConfigDict, Field

Positive = Annotated[float, Field(gt=0, le=100000, allow_inf_nan=False)]
NonNegative = Annotated[float, Field(ge=0, le=100000, allow_inf_nan=False)]
Key = Annotated[str, Field(pattern=r"^[a-z][a-z0-9_]{0,59}$")]
class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)
class Exercise(Input):
    name: str = Field(min_length=1, max_length=160)
    sets: int = Field(default=1, ge=1, le=100)
    reps: int | None = Field(default=None, ge=1, le=10000)
    minutes: Positive | None = None
    weight_kg: NonNegative | None = None
    notes: str = Field(default="", max_length=500)
class WorkoutIn(Input):
    day: date
    title: str = Field(min_length=1, max_length=160)
    sport: str = Field(min_length=1, max_length=80)
    notes: str = Field(default="", max_length=2000)
    exercises: list[Exercise] = Field(default_factory=list, max_length=100)
class NutrientIn(Input):
    key: Key
    label: str = Field(min_length=1, max_length=100)
    unit: str = Field(pattern=r"^(g|mg|mcg)$")
class FoodIn(Input):
    name: str = Field(min_length=1, max_length=180)
    calories: NonNegative
    nutrients: dict[Key, NonNegative] = Field(default_factory=dict)
class EntryIn(Input):
    food_id: int = Field(gt=0)
    day: date
    grams: Positive
    meal: str = Field(default="Gustare", min_length=1, max_length=60)
class GoalTypeIn(Input):
    key: Key
    label: str = Field(min_length=1, max_length=100)
    description: str = Field(default="", max_length=500)
class GoalIn(Input):
    effective_from: date
    goal_type: Key
    calories: Positive
    protein: NonNegative
    pace_kg_week: Annotated[float, Field(ge=-10, le=10, allow_inf_nan=False)] | None = None
    notes: str = Field(default="", max_length=1000)
