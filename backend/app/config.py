from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    secret_key: str = "hestia-secret-key"
    admin_username: str = "admin"
    admin_password_hash: str = ""
    database_url: str = "sqlite:///./hestia.db"
    upload_dir: str = "static/uploads/products"
    max_upload_size_mb: int = 5
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
