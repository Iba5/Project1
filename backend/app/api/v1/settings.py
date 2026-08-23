"""
Settings endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.storage import get_bucket_usage_bytes
from app.dependencies.auth import require_permission
from app.dependencies.database import get_db_session
from app.models.user import User
from app.permissions.rbac import Permission
from app.schemas.settings import SettingPublic, SettingUpdate
from app.services.settings import SettingsService

router = APIRouter()


def _mb_or_none(raw: object) -> float | None:
    """Settings values are stored as {"value": ...} JSON — coerce to a
    positive float, or None if unset/blank/invalid."""
    if isinstance(raw, dict):
        raw = raw.get("value")
    if raw in (None, ""):
        return None
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    return value if value > 0 else None


@router.get("/storage-stats")
async def get_storage_stats(
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.SETTINGS_READ)),
):
    """Simple used-vs-limit figures for DB and image (R2) storage. Limits
    come from admin-set settings — Postgres/R2 have no notion of a plan
    ceiling on their own, so without a limit set we only report usage."""
    svc = SettingsService(session)

    db_size_result = await session.execute(text("SELECT pg_database_size(current_database())"))
    db_used_bytes = db_size_result.scalar_one()

    try:
        image_used_bytes = get_bucket_usage_bytes()
    except Exception:
        image_used_bytes = None

    db_limit_setting = await svc.get_setting("db_storage_limit_mb")
    image_limit_setting = await svc.get_setting("image_storage_limit_mb")

    return {
        "db_used_mb": round(db_used_bytes / (1024 * 1024), 2),
        "db_limit_mb": _mb_or_none(db_limit_setting.value if db_limit_setting else None),
        "image_used_mb": round(image_used_bytes / (1024 * 1024), 2) if image_used_bytes is not None else None,
        "image_limit_mb": _mb_or_none(image_limit_setting.value if image_limit_setting else None),
    }


@router.get("", response_model=list[dict])
async def get_public_settings(session: AsyncSession = Depends(get_db_session)):
    """Public endpoint — returns a subset of site settings."""
    svc = SettingsService(session)
    return await svc.get_public_settings()


@router.get("/all", response_model=list[SettingPublic])
async def get_all_settings(
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.SETTINGS_READ)),
):
    """Admin endpoint — returns all settings."""
    svc = SettingsService(session)
    return await svc.get_all_settings()


@router.patch("/{key}", response_model=SettingPublic)
async def update_setting(
    key: str,
    body: SettingUpdate,
    session: AsyncSession = Depends(get_db_session),
    _user: User = Depends(require_permission(Permission.SETTINGS_WRITE)),
):
    svc = SettingsService(session)
    if body.value is None:
        raise HTTPException(status_code=400, detail="Value is required")
    setting = await svc.update_setting(key, body.value, body.description)
    return setting
