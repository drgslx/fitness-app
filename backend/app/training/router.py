from fastapi import APIRouter

from app.training.exercises_router import router as exercises_router
from app.training.sessions_router import router as sessions_router
from app.training.sports_router import router as sports_router
from app.training.templates_router import router as templates_router


router = APIRouter()
router.include_router(sports_router)
router.include_router(exercises_router)
router.include_router(sessions_router)
router.include_router(templates_router)
