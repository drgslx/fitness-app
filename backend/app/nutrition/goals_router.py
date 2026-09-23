from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.common import row, save
from app.core.security import current_user, require_admin
from app.db.session import get_db
from app.models.tracking import GoalType, NutritionGoal
from app.schemas.tracking import GoalIn, GoalTypeIn


router = APIRouter(tags=["nutrition-goals"])


@router.get("/goal-types")
def goal_types(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    items = db.scalars(select(GoalType).order_by(GoalType.key))
    return [row(item) for item in items]


@router.post(
    "/goal-types",
    status_code=201,
    dependencies=[Depends(require_admin)],
)
def add_goal_type(
    data: GoalTypeIn,
    db: Session = Depends(get_db),
):
    if db.get(GoalType, data.key):
        raise HTTPException(status_code=409, detail="Goal type exists")
    return save(db, GoalType(**data.model_dump()))


@router.get("/goals")
def goals(
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    items = db.scalars(
        select(NutritionGoal)
        .where(NutritionGoal.user_id == user["uid"])
        .order_by(NutritionGoal.effective_from.desc())
    )
    return [row(item) for item in items]


@router.put("/goals")
def set_goal(
    data: GoalIn,
    user=Depends(current_user),
    db: Session = Depends(get_db),
):
    if not db.get(GoalType, data.goal_type):
        raise HTTPException(status_code=422, detail="Unknown goal type")

    goal = db.scalar(
        select(NutritionGoal).where(
            NutritionGoal.user_id == user["uid"],
            NutritionGoal.effective_from == data.effective_from,
        )
    )
    if goal is None:
        goal = NutritionGoal(user_id=user["uid"])
    for key, value in data.model_dump().items():
        setattr(goal, key, value)
    return save(db, goal)
