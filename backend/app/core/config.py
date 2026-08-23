"""
Application configuration using pydantic-settings.
All settings are loaded from environment variables with sensible defaults.
"""

from __future__ import annotations

import json
from typing import List

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings

DEFAULT_JWT_SECRET = "change-me-in-production"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # ── Application ──────────────────────────────────────────────
    APP_NAME: str = "Canbri API"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "local"  # local | staging | production
    DEBUG: bool = True

    # ── Database ─────────────────────────────────────────────────
    # PostgreSQL via Supabase (asyncpg driver)
    CANBRI_DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/canbri"

    @property
    def DATABASE_URL(self) -> str:
        """Effective database URL for SQLAlchemy."""
        return self.CANBRI_DATABASE_URL

    @property
    def DATABASE_URL_SYNC(self) -> str:
        """Synchronous database URL for Alembic offline mode."""
        return self.CANBRI_DATABASE_URL.replace("+asyncpg", "")

    # ── Redis / Cache ────────────────────────────────────────────
    REDIS_URL: str = ""  # empty = in-memory cache fallback

    # ── JWT / Auth ───────────────────────────────────────────────
    JWT_SECRET_KEY: str = DEFAULT_JWT_SECRET
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── CORS ─────────────────────────────────────────────────────
    # Kept as a raw string, not List[str]: pydantic-settings tries to
    # JSON-decode any env var bound to a complex type (list/dict) before
    # our own validator ever runs, so a plain unbracketed value like
    # "https://example.com" blows up at import time with an opaque
    # SettingsError. Parsing it ourselves in CORS_ORIGINS_LIST avoids
    # that entirely and accepts both a JSON array and a comma-separated
    # string.
    CORS_ORIGINS: str = "http://localhost:3000"

    @property
    def CORS_ORIGINS_LIST(self) -> List[str]:
        try:
            parsed = json.loads(self.CORS_ORIGINS)
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    # ── Pagination ───────────────────────────────────────────────
    DEFAULT_PAGE_LIMIT: int = 20
    MAX_PAGE_LIMIT: int = 100

    # ── Security ─────────────────────────────────────────────────
    MAX_FAILED_LOGIN_ATTEMPTS: int = 5
    ACCOUNT_LOCK_MINUTES: int = 30

    # ── Rate Limiting ────────────────────────────────────────────
    RATE_LIMIT_REQUESTS: int = 60  # max requests per window
    RATE_LIMIT_WINDOW_SECONDS: int = 60  # sliding window size

    # ── Cloudflare R2 (media uploads, S3-compatible) ────────────
    R2_ACCOUNT_ID: str = ""
    R2_ACCESS_KEY_ID: str = ""
    R2_SECRET_ACCESS_KEY: str = ""
    R2_BUCKET_NAME: str = ""
    R2_PUBLIC_URL: str = ""  # public bucket domain or custom domain, no trailing slash

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }

    @model_validator(mode="after")
    def _refuse_insecure_production_config(self) -> "Settings":
        """Fail startup loudly rather than silently run production on a
        known, public default secret — anyone who reads this source file
        could otherwise forge admin JWTs against a misconfigured deploy."""
        if self.ENVIRONMENT == "production" and self.JWT_SECRET_KEY == DEFAULT_JWT_SECRET:
            raise ValueError(
                "JWT_SECRET_KEY is still the default placeholder value with "
                "ENVIRONMENT=production. Set a real, random JWT_SECRET_KEY "
                "(e.g. `openssl rand -hex 32`) in the production environment "
                "before starting the app."
            )
        return self


# Singleton instance
settings = Settings()
