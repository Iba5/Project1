"""
Catalogue repository.
"""

from __future__ import annotations

from typing import Optional

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.catalogue import CatalogueItem, Category
from app.repositories.base import BaseRepository


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session: AsyncSession):
        super().__init__(Category, session)

    async def get_by_slug(self, slug: str) -> Optional[Category]:
        stmt = select(Category).where(
            Category.slug == slug, Category.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()


class CatalogueItemRepository(BaseRepository[CatalogueItem]):
    def __init__(self, session: AsyncSession):
        super().__init__(CatalogueItem, session)

    async def get_by_slug(self, slug: str) -> Optional[CatalogueItem]:
        stmt = select(CatalogueItem).where(
            CatalogueItem.slug == slug, CatalogueItem.is_deleted == False  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()

    async def get_published(
        self, *, limit: int = 20, offset: int = 0
    ) -> list[CatalogueItem]:
        stmt = (
            select(CatalogueItem)
            .where(
                CatalogueItem.is_deleted == False,  # noqa: E712
                CatalogueItem.status == "published",
            )
            .offset(offset)
            .limit(limit)
        )
        result = await self.session.execute(stmt)
        return list(result.scalars().all())
