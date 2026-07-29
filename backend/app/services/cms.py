"""
CMS service: pages, content blocks, versions.
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.repositories.cms import ContentBlockRepository, PageRepository, PageVersionRepository
from app.utils.slug import generate_slug, unique_slug


class CMSService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.page_repo = PageRepository(session)
        self.block_repo = ContentBlockRepository(session)
        self.version_repo = PageVersionRepository(session)

    # ── Pages ─────────────────────────────────────────────────────
    async def list_pages(
        self, *, limit: int = 20, offset: int = 0, status: Optional[str] = None
    ) -> tuple[list, int]:
        filters: Dict[str, Any] = {}
        if status:
            filters["status"] = status
        items = await self.page_repo.get_many(limit=limit, offset=offset, filters=filters or None)
        total = await self.page_repo.count(filters=filters or None)
        return items, total

    async def get_page(self, page_id: str):
        return await self.page_repo.get_by_id(page_id)

    async def get_page_by_slug(self, slug: str):
        return await self.page_repo.get_by_slug(slug)

    async def create_page(self, data: Dict[str, Any]):
        slug = data.get("slug") or generate_slug(data["title"])
        existing = await self.page_repo.get_by_slug(slug)
        if existing:
            all_slugs = [p.slug for p in await self.page_repo.get_many(limit=1000)]
            slug = unique_slug(slug, all_slugs)
        data["slug"] = slug
        page = await self.page_repo.create(data)
        logger.info("Page created", extra={"structured": {"slug": slug}})
        return page

    async def update_page(self, page_id: str, data: Dict[str, Any]):
        # Check optimistic locking
        if "version" in data and data["version"] is not None:
            current = await self.page_repo.get_by_id(page_id)
            if current and current.version != data["version"]:
                raise ValueError("Version conflict: page has been modified by another user")
            data.pop("version")
            if current:
                data["version"] = current.version + 1
        return await self.page_repo.update(page_id, data)

    async def publish_page(self, page_id: str, user_id: Optional[str] = None):
        page = await self.page_repo.get_by_id(page_id)
        if not page:
            return None

        # Create a version snapshot before publishing
        snapshot = {
            "title": page.title,
            "slug": page.slug,
            "status": page.status,
            "version": page.version,
        }
        await self.version_repo.create({
            "page_id": page_id,
            "version_number": page.version,
            "snapshot": snapshot,
            "created_by": user_id,
        })

        page.status = "published"
        page.published_at = datetime.now(timezone.utc)
        page.version += 1
        await self.session.flush()
        return page

    async def archive_page(self, page_id: str):
        page = await self.page_repo.get_by_id(page_id)
        if not page:
            return None
        page.status = "archived"
        page.version += 1
        await self.session.flush()
        return page

    async def get_page_versions(self, page_id: str):
        return await self.version_repo.get_many(
            filters={"page_id": page_id}, limit=50, include_deleted=True
        )

    async def rollback_page(self, page_id: str, version_number: int, user_id: Optional[str] = None):
        page = await self.page_repo.get_by_id(page_id)
        if not page:
            return None

        versions = await self.version_repo.get_many(
            filters={"page_id": page_id, "version_number": version_number},
            include_deleted=True,
        )
        if not versions:
            raise ValueError(f"Version {version_number} not found")

        snapshot = versions[0].snapshot
        if snapshot:
            if "title" in snapshot:
                page.title = snapshot["title"]
            if "status" in snapshot:
                page.status = snapshot["status"]

        page.version += 1
        await self.session.flush()
        logger.info("Page rolled back", extra={"structured": {"page_id": page_id, "version": version_number}})
        return page
