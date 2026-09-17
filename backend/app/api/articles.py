import re
import unicodedata
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.core.security import require_admin
from app.db.session import get_db
from app.models.article import Article, ArticleImage
from app.schemas.article import ArticleOut
from app.services.storage import save_image

router = APIRouter(prefix="/articles", tags=["articles"])

def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value).encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9]+", "-", value).strip("-")

@router.get("", response_model=list[ArticleOut])
def list_articles(db: Session = Depends(get_db)):
    stmt = select(Article).where(Article.published.is_(True)).options(selectinload(Article.images)).order_by(Article.created_at.desc())
    return db.scalars(stmt).all()

@router.get("/{slug}", response_model=ArticleOut)
def get_article(slug: str, db: Session = Depends(get_db)):
    article = db.scalar(select(Article).where(Article.slug == slug, Article.published.is_(True)).options(selectinload(Article.images)))
    if not article: raise HTTPException(404, "Article not found")
    return article

@router.post("", response_model=ArticleOut, status_code=201, dependencies=[Depends(require_admin)])
async def create_article(title: str = Form(...), summary: str = Form(...), content: str = Form(...), published: bool = Form(True), images: list[UploadFile] = File(default=[]), db: Session = Depends(get_db)):
    images = [image for image in images if image.filename]
    if len(images) > 2: raise HTTPException(422, "An article accepts at most two images")
    if not (3 <= len(title.strip()) <= 180 and 10 <= len(summary.strip()) <= 500 and len(content.strip()) >= 20):
        raise HTTPException(422, "Invalid title, summary or content length")
    base = slugify(title)
    slug, suffix = base, 2
    while db.scalar(select(Article.id).where(Article.slug == slug)):
        slug, suffix = f"{base}-{suffix}", suffix + 1
    article = Article(title=title, slug=slug, summary=summary, content=content, published=published)
    db.add(article); db.flush()
    for position, image in enumerate(images):
        url = await save_image(image)
        article.images.append(ArticleImage(url=url, alt_text=f"{title} image {position + 1}", position=position))
    db.commit(); db.refresh(article)
    return article

@router.delete("/{article_id}", status_code=204, dependencies=[Depends(require_admin)])
def delete_article(article_id: int, db: Session = Depends(get_db)):
    article = db.get(Article, article_id)
    if not article: raise HTTPException(404, "Article not found")
    db.delete(article); db.commit()
