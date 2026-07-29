"""
Canbri API — FastAPI application entry point.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.v1.router import router as v1_router
from app.cache.manager import cache_manager
from app.core.config import settings
from app.core.logging import logger
from app.dependencies.database import engine
from app.middleware.cors import setup_cors
from app.middleware.error_handler import register_error_handlers
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.models.base import Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup / shutdown lifecycle."""
    # ── Startup ───────────────────────────────────────────────
    logger.info(
        f"Starting {settings.APP_NAME} v{settings.APP_VERSION} ({settings.ENVIRONMENT})"
    )

    # Run seed data (tables created via Alembic migrations, not create_all)
    try:
        from app.tasks.seed import seed
        await seed()
        logger.info("Seed data applied")
    except Exception as exc:
        logger.warning(f"Seed failed (non-fatal): {exc}")

    # Store environment in app state for error handler
    app.state.environment = settings.ENVIRONMENT

    yield

    # ── Shutdown ──────────────────────────────────────────────
    await cache_manager.close()
    await engine.dispose()
    logger.info("Shutdown complete")


# ── Create app ────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Canbri Platform REST API",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# ── Middleware (order matters: last added = first executed) ────────
setup_cors(app)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# ── Error handlers ────────────────────────────────────────────────
register_error_handlers(app)

# ── Routes ────────────────────────────────────────────────────────
app.include_router(v1_router, prefix="/api/v1")


# ── Root health check ─────────────────────────────────────────────
@app.get("/health")
async def root_health():
    return {"status": "ok", "version": settings.APP_VERSION}
