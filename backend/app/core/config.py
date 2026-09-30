from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from functools import lru_cache
from typing import List, Optional
from sqlalchemy.engine.url import make_url


class Settings(BaseSettings):
    # ─── Application ────────────────────────────────────────────────────────────
    app_name: str = "E-Learning Platform"
    app_env: str = "development"
    app_debug: bool = True
    app_host: str = "0.0.0.0"
    app_port: int = 8000

    # ─── Security ────────────────────────────────────────────────────────────────
    secret_key: str = "change-this-secret-key"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # ─── Database (Supabase PostgreSQL) ──────────────────────────────────────────
    database_url: str = ""
    database_echo: bool = False
    # SSL mode for asyncpg: 'require' (Supabase / remote) | 'prefer' | 'disable' (local)
    db_ssl_mode: str = "require"
    # Pool sizing: keep conservative for Supabase free-tier connection limits (or 0 for NullPool)
    db_pool_size: int = 5
    db_max_overflow: int = 10
    db_pool_timeout: int = 30
    db_pool_recycle: int = 1800
    # Prepared statement cache size: 0 is required for Supabase transaction pooler (port 6543)
    db_statement_cache_size: Optional[int] = 0

    @field_validator("database_url", mode="after")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        """
        Normalize DATABASE_URL for SQLAlchemy asyncpg:
        - Converts 'postgres://' or 'postgresql://' prefixes to 'postgresql+asyncpg://'.
        - Removes query parameters incompatible with asyncpg (like 'sslmode' or 'pgbouncer')
          so asyncpg does not raise unexpected keyword argument errors.
        """
        if not v:
            return v
        url_str = v.strip()
        if url_str.startswith("postgres://"):
            url_str = "postgresql+asyncpg://" + url_str[len("postgres://"):]
        elif url_str.startswith("postgresql://"):
            url_str = "postgresql+asyncpg://" + url_str[len("postgresql://"):]

        try:
            url = make_url(url_str)
            query_params = dict(url.query)
            # Remove parameters that asyncpg.connect does not accept as keyword args
            for unsupported_param in ["sslmode", "pgbouncer"]:
                query_params.pop(unsupported_param, None)
            url = url.set(query=query_params)
            return url.render_as_string(hide_password=False)
        except Exception:
            return url_str

    # ─── AI ──────────────────────────────────────────────────────────────────────
    gemini_api_key: str = ""
    openai_api_key: str = ""
    ai_provider: str = "gemini"  # gemini | openai

    # ─── Storage ─────────────────────────────────────────────────────────────────
    storage_provider: str = "cloudinary"
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    s3_bucket_name: str = ""
    s3_region: str = ""
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""

    # ─── CORS ────────────────────────────────────────────────────────────────────
    frontend_url: str = "http://localhost:5173"
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.allowed_origins.split(",")]

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    return Settings()
