from datetime import date
from typing import Annotated, Literal
from pydantic import BaseModel, ConfigDict, Field

Positive = Annotated[float, Field(gt=0, le=100000, allow_inf_nan=False)]
NonNegative = Annotated[float, Field(ge=0, le=100000, allow_inf_nan=False)]


class Input(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)


class RecipeIngredientIn(Input):
    food_id: int = Field(gt=0)
    grams: Positive


class RecipeIn(Input):
    name: str = Field(min_length=1, max_length=180)
    servings: Positive
    cooked_total_grams: NonNegative | None = None
    notes: str = Field(default="", max_length=1000)
    ingredients: list[RecipeIngredientIn] = Field(min_length=1, max_length=60)


class RecipeDiaryIn(Input):
    recipe_id: int = Field(gt=0)
    day: date
    meal: str = Field(default="Gustare", min_length=1, max_length=60)
    amount: Positive
    unit: Literal["grams", "servings"]
