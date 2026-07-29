"""
CMS repository.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.cms import ContentBlock, Page, PageVersion
from app.repositories.base import BaseRepository


class PageRepository(BaseRepository[Page]):
    def __init__(self, session: AsyncSession):
        super().__init__(Page, session)

    async def get_by_slug(self, slug: str) -> Optional[Page]:
        stmt = select(Page).where(
            Page.slug == slug, Page.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


class ContentBlockRepository(BaseRepository[ContentBlock]):
    def __init__(self, session: AsyncSession):
        super().__init__(ContentBlock, session)


class PageVersionRepository(BaseRepository[PageVersion]):
    def __init__(self, session: AsyncSession):
        super().__init__(PageVersion, session)
