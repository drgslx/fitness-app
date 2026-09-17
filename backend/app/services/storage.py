from io import BytesIO
from pathlib import Path
from uuid import uuid4
import re
from fastapi import UploadFile, HTTPException
from fastapi.responses import FileResponse, Response
from google.cloud import storage
from google.api_core.exceptions import NotFound
from PIL import Image, UnidentifiedImageError
from app.core.config import settings

MAX_BYTES = 5 * 1024 * 1024
Image.MAX_IMAGE_PIXELS = 20_000_000
ALLOWED = {"image/jpeg", "image/png", "image/webp"}
MIME = {".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp"}

def bucket():
    if not settings.gcs_bucket:
        raise HTTPException(503, "GCS_BUCKET is required")
    return storage.Client().bucket(settings.gcs_bucket)

async def save_image(file: UploadFile) -> str:
    if file.content_type not in ALLOWED:
        raise HTTPException(415, "Only JPEG, PNG and WebP images are accepted")
    data = await file.read(MAX_BYTES + 1)
    if len(data) > MAX_BYTES:
        raise HTTPException(413, "Image must be at most 5 MB")
    try:
        with Image.open(BytesIO(data)) as original:
            if original.width * original.height > Image.MAX_IMAGE_PIXELS:
                raise ValueError("Too many pixels")
            original.load()
            converted = original.convert("RGB")
            converted.thumbnail((2400, 2400))
            output = BytesIO()
            converted.save(output, format="WEBP", quality=85)
            data = output.getvalue()
    except (UnidentifiedImageError, OSError, ValueError, Image.DecompressionBombError):
        raise HTTPException(415, "Invalid image or image too large")
    name = uuid4().hex + ".webp"
    if settings.storage_backend == "gcs":
        bucket().blob(name).upload_from_string(data, content_type="image/webp")
    elif settings.storage_backend == "local":
        target = Path(settings.upload_dir); target.mkdir(parents=True, exist_ok=True)
        (target / name).write_bytes(data)
    else:
        raise HTTPException(503, "Unknown storage backend")
    return "/uploads/" + name

def read_image(name: str):
    if not re.fullmatch(r"[a-f0-9]{32}\.(jpg|png|webp)", name):
        raise HTTPException(404, "Image not found")
    media_type = MIME[Path(name).suffix]
    if settings.storage_backend == "gcs":
        try:
            data = bucket().blob(name).download_as_bytes()
        except NotFound:
            raise HTTPException(404, "Image not found")
        return Response(data, media_type=media_type, headers={"Cache-Control": "public, max-age=3600"})
    path = Path(settings.upload_dir) / name
    if not path.is_file(): raise HTTPException(404, "Image not found")
    return FileResponse(path, media_type=media_type)
