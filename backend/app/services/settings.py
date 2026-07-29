"""
Settings service.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.repositories.settings import SettingRepository


# Keys that are safe to expose to the public
PUBLIC_SETTING_KEYS = [
    "site_name",
    "site_description",
    "site_email",
    "site_phone",
    "site_whatsapp",
    "site_url",
    "business_hours",
    "delivery_areas",
    "founding_year",
    "social_facebook",
    "social_instagram",
]


class SettingsService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = SettingRepository(session)

    async def get_public_settings(self) -> List[dict]:
        results = []
        for key in PUBLIC_SETTING_KEYS:
            setting = await self.repo.get_by_key(key)
            if setting:
                results.append({
                    "key": setting.key,
                    "value": setting.value,
                })
        return results

    async def get_all_settings(self) -> List[dict]:
        items = await self.repo.get_many(limit=1000)
        return items

    async def get_setting(self, key: str):
        return await self.repo.get_by_key(key)

    async def update_setting(self, key: str, value: Dict[str, Any], description: Optional[str] = None):
        setting = await self.repo.upsert(key, value, description)
        logger.info("Setting updated", extra={"structured": {"key": key}})
        return setting
