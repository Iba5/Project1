"""
Gallery repository.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.gallery import MediaCollection, MediaCollectionItem, MediaItem
from app.repositories.base import BaseRepository


class MediaItemRepository(BaseRepository[MediaItem]):
    def __init__(self, session: AsyncSession):
        super().__init__(MediaItem, session)


class MediaCollectionRepository(BaseRepository[MediaCollection]):
    def __init__(self, session: AsyncSession):
        super().__init__(MediaCollection, session)

    async def get_by_slug(self, slug: str) -> Optional[MediaCollection]:
        stmt = select(MediaCollection).where(
            MediaCollection.slug == slug, MediaCollection.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
