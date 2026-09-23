from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import validate_date_range
from app.core.security import current_user
from app.db.session import get_db
from app.models.recipe import RecipeDiaryEntry
from app.models.tracking import DiaryEntry, NutritionGoal


router = APIRouter(tags=["nutrition-reports"])


@router.get("/nutrition-report")
def report(
    start: date,
    end: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    validate_date_range(start, end)

    days = {}
    target_rows = db.scalars(
        select(NutritionGoal)
        .where(
            NutritionGoal.user_id == user["uid"],
            NutritionGoal.effective_from <= end,
        )
        .order_by(NutritionGoal.effective_from)
    ).all()

    for offset in range((end - start).days + 1):
        current_day = start + timedelta(days=offset)
        applicable = [
            goal
            for goal in target_rows
            if goal.effective_from <= current_day
        ]
        goal = applicable[-1] if applicable else None
        days[current_day] = {
            "day": current_day.isoformat(),
            "entries": 0,
            "calories": 0.0,
            "nutrients": {},
            "target": goal.calories if goal else None,
            "protein_target": goal.protein if goal else None,
        }

    entries = list(
        db.scalars(
            select(DiaryEntry).where(
                DiaryEntry.user_id == user["uid"],
                DiaryEntry.day.between(start, end),
            )
        )
    )
    entries += list(
        db.scalars(
            select(RecipeDiaryEntry).where(
                RecipeDiaryEntry.user_id == user["uid"],
                RecipeDiaryEntry.day.between(start, end),
            )
        )
    )

    for entry in entries:
        target = days[entry.day]
        multiplier = entry.grams / 100
        target["entries"] += 1
        target["calories"] += entry.snapshot["calories"] * multiplier
        for key, value in entry.snapshot["nutrients"].items():
            target["nutrients"][key] = (
                target["nutrients"].get(key, 0) + value * multiplier
            )

    weeks = {}
    for current_day, total in days.items():
        total["calories"] = round(total["calories"], 2)
        total["nutrients"] = {
            key: round(value, 2)
            for key, value in total["nutrients"].items()
        }
        total["difference"] = (
            round(total["calories"] - total["target"], 2)
            if total["target"] is not None
            else None
        )

        monday = (
            current_day - timedelta(days=current_day.weekday())
        ).isoformat()
        week = weeks.setdefault(
            monday,
            {
                "week_start": monday,
                "calories": 0.0,
                "days_in_range": 0,
                "logged_days": 0,
                "nutrients": {},
            },
        )
        week["days_in_range"] += 1
        week["logged_days"] += int(total["entries"] > 0)
        week["calories"] += total["calories"]
        for key, value in total["nutrients"].items():
            week["nutrients"][key] = (
                week["nutrients"].get(key, 0) + value
            )

    for week in weeks.values():
        week["calories"] = round(week["calories"], 2)
        week["daily_average_all_days"] = round(
            week["calories"] / week["days_in_range"],
            2,
        )
        week["daily_average_logged_days"] = (
            round(week["calories"] / week["logged_days"], 2)
            if week["logged_days"]
            else None
        )
        week["nutrients"] = {
            key: round(value, 2)
            for key, value in week["nutrients"].items()
        }

    return {
        "days": [
            total
            for total in days.values()
            if total["entries"] > 0
        ],
        "weeks": list(weeks.values()),
    }
