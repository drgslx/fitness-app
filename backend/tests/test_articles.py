import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from app.main import app
from app.db.base import Base
from app.db.session import get_db
from app.core import security
from app.models.article import Article

@pytest.fixture
def client():
    test_url = os.environ.get("TEST_DATABASE_URL")
    engine = create_engine(test_url) if test_url else create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    if not test_url:
        Base.metadata.create_all(engine)
    connection = engine.connect()
    transaction = connection.begin()
    session = sessionmaker(bind=connection, join_transaction_mode="create_savepoint")
    def database():
        with session() as db:
            yield db
    app.dependency_overrides[get_db] = database
    with TestClient(app) as test:
        yield test, session
    app.dependency_overrides.clear()
    transaction.rollback()
    connection.close()
    engine.dispose()

def test_anonymous_and_old_key_cannot_write(client):
    test, _ = client
    assert test.post("/api/v1/articles", headers={"X-Admin-Key": "change-me-local-only"}).status_code == 401
    assert test.delete("/api/v1/articles/1").status_code == 401

def test_normal_user_cannot_write(client):
    test, _ = client
    app.dependency_overrides[security.current_user] = lambda: {"uid": "ordinary"}
    assert test.delete("/api/v1/articles/1").status_code == 403
    assert test.post("/api/v1/articles").status_code == 403

def test_admin_create_read_and_delete(client):
    test, _ = client
    app.dependency_overrides[security.current_user] = lambda: {"uid": "owner", "admin": True}
    result = test.post("/api/v1/articles", data={"title": "Sport test", "summary": "A valid summary for this article", "content": "A valid article body longer than twenty characters."})
    assert result.status_code == 201, result.text
    article = result.json()
    assert article["id"] > 0
    assert test.get("/api/v1/articles/" + article["slug"]).json()["content"] == article["content"]
    assert len(test.get("/api/v1/articles").json()) == 1
    assert test.delete("/api/v1/articles/" + str(article["id"])).status_code == 204
    assert test.get("/api/v1/articles/" + article["slug"]).status_code == 404

def test_drafts_and_missing_slugs_are_not_public(client):
    test, session = client
    with session() as db:
        db.add(Article(title="Draft", slug="draft", summary="Draft summary", content="Draft text", published=False))
        db.commit()
    assert test.get("/api/v1/articles").json() == []
    assert test.get("/api/v1/articles/draft").status_code == 404
    assert test.get("/api/v1/articles/missing").status_code == 404

def test_invalid_token_is_rejected(client, monkeypatch):
    test, _ = client
    monkeypatch.setattr(security, "firebase_app", lambda: object())
    def invalid(*args, **kwargs):
        raise security.auth.InvalidIdTokenError("invalid")
    monkeypatch.setattr(security.auth, "verify_id_token", invalid)
    assert test.delete("/api/v1/articles/1", headers={"Authorization": "Bearer forged"}).status_code == 401

def test_verifier_checks_revocation(client, monkeypatch):
    test, _ = client
    monkeypatch.setattr(security, "firebase_app", lambda: object())
    def valid(token, **kwargs):
        assert token == "verified"
        assert kwargs["check_revoked"] is True
        return {"uid": "ordinary"}
    monkeypatch.setattr(security.auth, "verify_id_token", valid)
    assert test.delete("/api/v1/articles/1", headers={"Authorization": "Bearer verified"}).status_code == 403
