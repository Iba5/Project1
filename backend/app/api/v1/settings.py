"""
Settings endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.auth import require_permission
from app.dependencies.database import get_db_session
from app.models.user import User
from app.permissions.rbac import Permission
from app.schemas.settings import SettingPublic, SettingUpdate
from app.services.settings import SettingsService

router = APIRouter()


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
