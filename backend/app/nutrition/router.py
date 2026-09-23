from fastapi import APIRouter

from app.nutrition.diary_router import router as diary_router
from app.nutrition.foods_router import router as foods_router
from app.nutrition.goals_router import router as goals_router
from app.nutrition.nutrients_router import router as nutrients_router
from app.nutrition.reports_router import router as reports_router


router = APIRouter()
router.include_router(nutrients_router)
router.include_router(foods_router)
router.include_router(diary_router)
router.include_router(goals_router)
router.include_router(reports_router)
