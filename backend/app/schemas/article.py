from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field

class ImageOut(BaseModel):
    id: int
    url: str
    alt_text: str
    position: int
    model_config = ConfigDict(from_attributes=True)

class ArticleCreate(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    summary: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20)
    published: bool = True

class ArticleOut(ArticleCreate):
    id: int
    slug: str
    created_at: datetime
    updated_at: datetime
    images: list[ImageOut] = []
    model_config = ConfigDict(from_attributes=True)

