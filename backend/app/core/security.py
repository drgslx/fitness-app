from functools import lru_cache
import logging
import firebase_admin
from firebase_admin import auth
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.core.config import settings

bearer = HTTPBearer(auto_error=False)

@lru_cache
def firebase_app():
    if not settings.firebase_project_id:
        raise HTTPException(503, "Configure FIREBASE_PROJECT_ID on the API")
    return firebase_admin.initialize_app(options={"projectId": settings.firebase_project_id})

def current_user(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if credentials is None:
        raise HTTPException(401, "Authentication required", headers={"WWW-Authenticate": "Bearer"})
    try:
        app = firebase_app()
        return auth.verify_id_token(credentials.credentials, app=app, check_revoked=True)
    except HTTPException:
        raise
    except (auth.InvalidIdTokenError, auth.RevokedIdTokenError, auth.UserDisabledError, ValueError):
        raise HTTPException(401, "Invalid or expired session")
    except Exception:
        logging.exception("Firebase verification unavailable")
        raise HTTPException(503, "Authentication service unavailable")

def require_admin(user: dict = Depends(current_user)):
    if user.get("admin") is not True:
        raise HTTPException(403, "Admin role required")
    return user
