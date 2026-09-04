"""
Settings repository.
"""

from __future__ import annotations

from typing import Optional, Sequence

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.settings import Setting
from app.repositories.base import BaseRepository


class SettingRepository(BaseRepository[Setting]):
    def __init__(self, session: AsyncSession):
        super().__init__(Setting, session)

    async def get_by_key(self, key: str) -> Optional[Setting]:
        stmt = select(Setting).where(
            Setting.key == key, Setting.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_keys(self, keys: Sequence[str]) -> list[Setting]:
        stmt = select(Setting).where(
            Setting.key.in_(keys), Setting.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())

    async def upsert(self, key: str, value: dict, description: str | None = None) -> Setting:
        existing = await self.get_by_key(key)
        if existing:
            existing.value = value
            if description is not None:
                existing.description = description
            await self.session.flush()
            await self.session.refresh(existing)
            return existing
        return await self.create({"key": key, "value": value, "description": description})
