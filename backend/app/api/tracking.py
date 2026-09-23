"""Compatibility router that assembles the domain routers.

main.py can keep importing `router` from this module, so existing API paths
and frontend calls remain unchanged during the refactor.
"""

from fastapi import APIRouter

from app.api.profile import router as profile_router
from app.nutrition.router import router as nutrition_router
from app.training.router import router as training_router


router = APIRouter()
router.include_router(profile_router)
router.include_router(training_router)
router.include_router(nutrition_router)
