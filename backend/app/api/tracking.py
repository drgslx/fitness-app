from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import Session
from app.core.security import current_user, require_admin
from app.db.session import get_db
from app.models.tracking import Workout, WorkoutLog, Nutrient, Food, DiaryEntry, GoalType, NutritionGoal
from app.schemas.tracking import WorkoutIn, NutrientIn, FoodIn, EntryIn, GoalTypeIn, GoalIn
from sqlalchemy import func, select
from app.models.recipe import RecipeDiaryEntry
from app.models.tracking import (
    Workout,
    WorkoutLog,
    Nutrient,
    Food,
    DiaryEntry,
    GoalType,
    NutritionGoal,
    SportType,
    ExerciseDefinition,
)
from app.schemas.tracking import (
    WorkoutIn,
    NutrientIn,
    FoodIn,
    EntryIn,
    GoalTypeIn,
    GoalIn,
    SportTypeIn,
    ExerciseDefinitionIn,
)

router = APIRouter(tags=["tracking"])
def row(item):
    return {column.name: getattr(item, column.name) for column in item.__table__.columns}
def owner(db, model, item_id, user):
    item = db.scalar(select(model).where(model.id == item_id, model.user_id == user["uid"]))
    if item is None:
        raise HTTPException(404, "Not found")
    return item
def dates(start, end):
    if end < start or (end - start).days > 366:
        raise HTTPException(422, "Choose an ordered range of at most 367 days")
def save(db, item):
    db.add(item); db.commit(); db.refresh(item)
    return row(item)

@router.get("/sport-types")
def sport_types(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    items = db.scalars(
        select(SportType)
        .where(
            SportType.user_id == user["uid"],
            SportType.is_active.is_(True),
        )
        .order_by(SportType.name)
    ).all()

    return [row(item) for item in items]


@router.post("/sport-types", status_code=201)
def add_sport_type(
    data: SportTypeIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    existing = db.scalar(
        select(SportType).where(
            SportType.user_id == user["uid"],
            func.lower(SportType.name) == data.name.lower(),
        )
    )

    if existing:
        raise HTTPException(409, "Sport type already exists")

    return save(
        db,
        SportType(
            user_id=user["uid"],
            name=data.name,
        ),
    )


@router.delete("/sport-types/{sport_id}", status_code=204)
def delete_sport_type(
    sport_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    sport = owner(db, SportType, sport_id, user)
    sport.is_active = False
    db.commit()


@router.get("/sport-types/{sport_id}/exercises")
def exercise_definitions(
    sport_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    owner(db, SportType, sport_id, user)

    items = db.scalars(
        select(ExerciseDefinition)
        .where(
            ExerciseDefinition.sport_type_id == sport_id,
            ExerciseDefinition.user_id == user["uid"],
            ExerciseDefinition.is_active.is_(True),
        )
        .order_by(ExerciseDefinition.name)
    ).all()

    return [row(item) for item in items]


@router.post("/sport-types/{sport_id}/exercises", status_code=201)
def add_exercise_definition(
    sport_id: int,
    data: ExerciseDefinitionIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    owner(db, SportType, sport_id, user)

    existing = db.scalar(
        select(ExerciseDefinition).where(
            ExerciseDefinition.sport_type_id == sport_id,
            func.lower(ExerciseDefinition.name) == data.name.lower(),
        )
    )

    if existing:
        raise HTTPException(409, "Exercise already exists for this sport")

    return save(
        db,
        ExerciseDefinition(
            user_id=user["uid"],
            sport_type_id=sport_id,
            name=data.name,
            tracking_type=data.tracking_type,
        ),
    )


@router.delete("/exercises/{exercise_id}", status_code=204)
def delete_exercise_definition(
    exercise_id: int,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    exercise = owner(
        db,
        ExerciseDefinition,
        exercise_id,
        user,
    )

    exercise.is_active = False
    db.commit()

@router.get("/me")
def me(user=Depends(current_user)):
    return {"uid": user["uid"], "email": user.get("email"), "admin": user.get("admin") is True}

@router.get("/workouts")
def workouts(start: date, end: date, user=Depends(current_user), db: Session = Depends(get_db)):
    dates(start, end)
    plans = db.scalars(select(Workout).where(Workout.user_id == user["uid"], Workout.day.between(start, end)).order_by(Workout.day, Workout.id)).all()
    completed = set(db.scalars(select(WorkoutLog.workout_id).where(WorkoutLog.user_id == user["uid"])).all())
    return [dict(row(plan), completed=plan.id in completed) for plan in plans]

@router.post("/workouts", status_code=201)
def add_workout(data: WorkoutIn, user=Depends(current_user), db: Session = Depends(get_db)):
    values = data.model_dump()
    return save(db, Workout(user_id=user["uid"], **values))

@router.put("/workouts/{item_id}")
def edit_workout(item_id: int, data: WorkoutIn, user=Depends(current_user), db: Session = Depends(get_db)):
    plan = owner(db, Workout, item_id, user)
    for key, value in data.model_dump().items():
        setattr(plan, key, value)
    return save(db, plan)

@router.delete("/workouts/{item_id}", status_code=204)
def remove_workout(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    db.delete(owner(db, Workout, item_id, user)); db.commit()

@router.put("/workouts/{item_id}/completion")
def complete(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    plan = owner(db, Workout, item_id, user)
    # Serialize concurrent completion requests on PostgreSQL.
    db.execute(select(Workout.id).where(Workout.id == item_id).with_for_update())
    log = db.scalar(select(WorkoutLog).where(WorkoutLog.workout_id == item_id))
    if log is None:
        log = WorkoutLog(workout_id=plan.id, user_id=user["uid"], day=plan.day,
                         snapshot={"title": plan.title, "sport": plan.sport, "notes": plan.notes, "exercises": plan.exercises})
    return save(db, log)

@router.delete("/workouts/{item_id}/completion", status_code=204)
def uncomplete(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    owner(db, Workout, item_id, user)
    log = db.scalar(select(WorkoutLog).where(WorkoutLog.workout_id == item_id, WorkoutLog.user_id == user["uid"]))
    if log:
        db.delete(log); db.commit()

@router.get("/workout-history")
def history(start: date, end: date, user=Depends(current_user), db: Session = Depends(get_db)):
    dates(start, end)
    return [row(x) for x in db.scalars(select(WorkoutLog).where(WorkoutLog.user_id == user["uid"], WorkoutLog.day.between(start, end)).order_by(WorkoutLog.day))]

@router.get("/nutrients")
def nutrients(user=Depends(current_user), db: Session = Depends(get_db)):
    return [row(x) for x in db.scalars(select(Nutrient).order_by(Nutrient.key))]

@router.post("/nutrients", status_code=201, dependencies=[Depends(require_admin)])
def add_nutrient(data: NutrientIn, db: Session = Depends(get_db)):
    if db.get(Nutrient, data.key):
        raise HTTPException(409, "Nutrient key exists")
    return save(db, Nutrient(**data.model_dump()))

def validate_food(data, db):
    keys = set(db.scalars(select(Nutrient.key)))
    if set(data.nutrients) - keys:
        raise HTTPException(422, "Unknown nutrient")
    if not {"carbohydrates", "protein", "fat", "salt"}.issubset(data.nutrients):
        raise HTTPException(422, "Carbohydrates, protein, fat and salt are required per 100 g")

@router.get("/foods")
def foods(q: str = Query(default="", max_length=180), user=Depends(current_user), db: Session = Depends(get_db)):
    query = select(Food).order_by(Food.name).limit(200)
    if q.strip():
        query = query.where(Food.name.ilike("%" + q.strip() + "%"))
    return [row(x) for x in db.scalars(query)]

@router.post("/foods", status_code=201)
def add_food(data: FoodIn, user=Depends(current_user), db: Session = Depends(get_db)):
    validate_food(data, db)
    return save(db, Food(user_id=user["uid"], **data.model_dump()))

@router.put("/foods/{item_id}")
def edit_food(item_id: int, data: FoodIn, user=Depends(current_user), db: Session = Depends(get_db)):
    food = db.get(Food, item_id)
    if food is None: raise HTTPException(404, "Food not found")
    if food.user_id != user["uid"] and user.get("admin") is not True:
        raise HTTPException(403, "Only the author or an admin can edit a food")
    validate_food(data, db)
    for key, value in data.model_dump().items(): setattr(food, key, value)
    return save(db, food)

@router.delete("/foods/{item_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_food(item_id: int, db: Session = Depends(get_db)):
    food = db.get(Food, item_id)
    if food is None:
        raise HTTPException(404, "Food not found")

    db.delete(food)
    db.commit()

def entry_values(data, db):
    food = db.get(Food, data.food_id)
    if food is None: raise HTTPException(404, "Food not found")
    return {**data.model_dump(), "snapshot": {"name": food.name, "calories": food.calories, "nutrients": food.nutrients}}

@router.get("/diary")
def diary(day: date, user=Depends(current_user), db: Session = Depends(get_db)):
    food_entries = [
        {**row(item), "entry_type": "food", "source_id": item.id}
        for item in db.scalars(
            select(DiaryEntry)
            .where(
                DiaryEntry.user_id == user["uid"],
                DiaryEntry.day == day,
            )
            .order_by(DiaryEntry.id)
        )
    ]
    
    recipe_entries = [
        {**row(item), "entry_type": "recipe", "source_id": item.id}
        for item in db.scalars(
            select(RecipeDiaryEntry)
            .where(
                RecipeDiaryEntry.user_id == user["uid"],
                RecipeDiaryEntry.day == day,
            )
            .order_by(RecipeDiaryEntry.id)
        )
    ]
    
    return sorted(
        food_entries + recipe_entries,
        key=lambda item: (item["meal"], item["id"]),
    )

@router.post("/diary", status_code=201)
def add_entry(data: EntryIn, user=Depends(current_user), db: Session = Depends(get_db)):
    return save(db, DiaryEntry(user_id=user["uid"], **entry_values(data, db)))

@router.put("/diary/{item_id}")
def edit_entry(item_id: int, data: EntryIn, user=Depends(current_user), db: Session = Depends(get_db)):
    entry = owner(db, DiaryEntry, item_id, user)
    values = data.model_dump()
    # Keep historical composition for quantity/date edits of the same food.
    if entry.food_id != data.food_id: values = entry_values(data, db)
    for key, value in values.items(): setattr(entry, key, value)
    return save(db, entry)

@router.delete("/diary/{item_id}", status_code=204)
def remove_entry(item_id: int, user=Depends(current_user), db: Session = Depends(get_db)):
    db.delete(owner(db, DiaryEntry, item_id, user)); db.commit()

@router.get("/goal-types")
def goal_types(user=Depends(current_user), db: Session = Depends(get_db)):
    return [row(x) for x in db.scalars(select(GoalType).order_by(GoalType.key))]

@router.post("/goal-types", status_code=201, dependencies=[Depends(require_admin)])
def add_goal_type(data: GoalTypeIn, db: Session = Depends(get_db)):
    if db.get(GoalType, data.key): raise HTTPException(409, "Goal type exists")
    return save(db, GoalType(**data.model_dump()))

@router.get("/goals")
def goals(user=Depends(current_user), db: Session = Depends(get_db)):
    return [row(x) for x in db.scalars(select(NutritionGoal).where(NutritionGoal.user_id == user["uid"]).order_by(NutritionGoal.effective_from.desc()))]

@router.put("/goals")
def set_goal(data: GoalIn, user=Depends(current_user), db: Session = Depends(get_db)):
    if not db.get(GoalType, data.goal_type): raise HTTPException(422, "Unknown goal type")
    goal = db.scalar(select(NutritionGoal).where(NutritionGoal.user_id == user["uid"], NutritionGoal.effective_from == data.effective_from))
    if goal is None: goal = NutritionGoal(user_id=user["uid"])
    for key, value in data.model_dump().items(): setattr(goal, key, value)
    return save(db, goal)

@router.get("/nutrition-report")
def report(
    start: date,
    end: date,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    dates(start, end)

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
        day = start + timedelta(days=offset)
        applicable = [goal for goal in target_rows if goal.effective_from <= day]
        goal = applicable[-1] if applicable else None

        days[day] = {
            "day": day.isoformat(),
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

    for day, total in days.items():
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

        monday = (day - timedelta(days=day.weekday())).isoformat()

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
        "days": list(days.values()),
        "weeks": list(weeks.values()),
    }
