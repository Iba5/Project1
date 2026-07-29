"""
Catalogue service: business logic for categories and items.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.repositories.catalogue import CatalogueItemRepository, CategoryRepository
from app.utils.slug import generate_slug, unique_slug


class CatalogueService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.item_repo = CatalogueItemRepository(session)
        self.category_repo = CategoryRepository(session)

    # ── Categories ────────────────────────────────────────────────
    async def list_categories(
        self, *, limit: int = 20, offset: int = 0
    ) -> tuple[list, int]:
        items = await self.category_repo.get_many(limit=limit, offset=offset)
        total = await self.category_repo.count()
        return items, total

    async def get_category(self, category_id: str):
        return await self.category_repo.get_by_id(category_id)

    async def create_category(self, data: Dict[str, Any]):
        slug = data.get("slug") or generate_slug(data["name"])
        existing = await self.category_repo.get_by_slug(slug)
        if existing:
            all_slugs = [c.slug for c in await self.category_repo.get_many(limit=1000)]
            slug = unique_slug(slug, all_slugs)
        data["slug"] = slug
        category = await self.category_repo.create(data)
        logger.info("Category created", extra={"structured": {"slug": slug}})
        return category

    async def update_category(self, category_id: str, data: Dict[str, Any]):
        return await self.category_repo.update(category_id, data)

    # ── Items ─────────────────────────────────────────────────────
    async def list_items(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
        category_id: Optional[str] = None,
        status: Optional[str] = None,
        is_featured: Optional[bool] = None,
    ) -> tuple[list, int]:
        filters: Dict[str, Any] = {}
        if category_id:
            filters["category_id"] = category_id
        if status:
            filters["status"] = status
        if is_featured is not None:
            filters["is_featured"] = is_featured
        items = await self.item_repo.get_many(limit=limit, offset=offset, filters=filters or None)
        total = await self.item_repo.count(filters=filters or None)
        return items, total

    async def get_item(self, item_id: str):
        return await self.item_repo.get_by_id(item_id)

    async def create_item(self, data: Dict[str, Any]):
        slug = data.get("slug") or generate_slug(data["name"])
        existing = await self.item_repo.get_by_slug(slug)
        if existing:
            all_slugs = [i.slug for i in await self.item_repo.get_many(limit=1000)]
            slug = unique_slug(slug, all_slugs)
        data["slug"] = slug
        item = await self.item_repo.create(data)
        logger.info("Catalogue item created", extra={"structured": {"slug": slug}})
        return item

    async def update_item(self, item_id: str, data: Dict[str, Any]):
        # Check optimistic locking
        if "version" in data and data["version"] is not None:
            current = await self.item_repo.get_by_id(item_id)
            if current and current.version != data["version"]:
                raise ValueError("Version conflict: item has been modified by another user")
            data.pop("version")
            if current:
                data["version"] = current.version + 1
        return await self.item_repo.update(item_id, data)

    async def delete_item(self, item_id: str):
        return await self.item_repo.soft_delete(item_id)
