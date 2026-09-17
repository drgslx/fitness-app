from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://sport:sport-local-password@localhost:5432/sportdb"
    upload_dir: str = "./uploads"
    firebase_project_id: str = ""
    storage_backend: str = "local"
    gcs_bucket: str = ""
    cors_origins: str = "http://localhost:3000,http://localhost:5173"
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
