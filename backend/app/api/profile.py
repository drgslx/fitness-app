from fastapi import APIRouter, Depends

from app.core.security import current_user


router = APIRouter(tags=["profile"])


@router.get("/me")
def me(user=Depends(current_user)):
    return {
        "uid": user["uid"],
        "email": user.get("email"),
        "admin": user.get("admin") is True,
    }
