"""
Gallery service.
"""

from __future__ import annotations

from typing import Any, Dict, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.repositories.gallery import MediaCollectionRepository, MediaItemRepository
from app.utils.slug import generate_slug, unique_slug


class GalleryService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.item_repo = MediaItemRepository(session)
        self.collection_repo = MediaCollectionRepository(session)

    # ── Media Items ───────────────────────────────────────────────
    async def list_items(
        self, *, limit: int = 20, offset: int = 0, category: Optional[str] = None
    ) -> tuple[list, int]:
        filters: Dict[str, Any] = {}
        if category:
            filters["category"] = category
        items = await self.item_repo.get_many(limit=limit, offset=offset, filters=filters or None)
        total = await self.item_repo.count(filters=filters or None)
        return items, total

    async def get_item(self, item_id: str):
        return await self.item_repo.get_by_id(item_id)

    async def create_item(self, data: Dict[str, Any]):
        item = await self.item_repo.create(data)
        logger.info("Media item created", extra={"structured": {"title": data.get("title")}})
        return item

    async def update_item(self, item_id: str, data: Dict[str, Any]):
        return await self.item_repo.update(item_id, data)

    async def delete_item(self, item_id: str):
        return await self.item_repo.soft_delete(item_id)

    # ── Collections ───────────────────────────────────────────────
    async def list_collections(
        self, *, limit: int = 20, offset: int = 0
    ) -> tuple[list, int]:
        items = await self.collection_repo.get_many(limit=limit, offset=offset)
        total = await self.collection_repo.count()
        return items, total

    async def create_collection(self, data: Dict[str, Any]):
        slug = data.get("slug") or generate_slug(data["name"])
        existing = await self.collection_repo.get_by_slug(slug)
        if existing:
            all_slugs = [c.slug for c in await self.collection_repo.get_many(limit=1000)]
            slug = unique_slug(slug, all_slugs)
        data["slug"] = slug
        collection = await self.collection_repo.create(data)
        logger.info("Collection created", extra={"structured": {"slug": slug}})
        return collection

    async def update_collection(self, collection_id: str, data: Dict[str, Any]):
        return await self.collection_repo.update(collection_id, data)

    async def delete_collection(self, collection_id: str):
        return await self.collection_repo.soft_delete(collection_id)
