from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from app.api.articles import router as articles_router
from app.core.config import settings
from app.api.tracking import router as tracking_router
from app.db.session import get_db
from fastapi import Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.orm import Session
from app.services.storage import read_image

app = FastAPI(title="Sport Platform API", version="0.3.0")
app.add_middleware(CORSMiddleware, allow_origins=settings.cors_origins.split(","), allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
Path(settings.upload_dir).mkdir(parents=True, exist_ok=True)
app.get("/uploads/{name}")(read_image)
app.include_router(articles_router, prefix="/api/v1")
app.include_router(tracking_router, prefix="/api/v1")

@app.get("/healthz")
def health(): return {"status": "ok"}

@app.get("/readyz")
def ready(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        raise HTTPException(503, "Database unavailable")
