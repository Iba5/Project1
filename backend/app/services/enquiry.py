"""
Enquiry service.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.models.enquiry import Enquiry
from app.repositories.enquiry import EnquiryRepository


class EnquiryService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = EnquiryRepository(session)

    async def list_enquiries(
        self,
        *,
        limit: int = 20,
        offset: int = 0,
        status: Optional[str] = None,
    ) -> tuple[list, int]:
        filters: Dict[str, Any] = {}
        if status:
            filters["status"] = status
        items = await self.repo.get_many(limit=limit, offset=offset, filters=filters or None)
        total = await self.repo.count(filters=filters or None)
        return items, total

    async def get_enquiry(self, enquiry_id: str):
        return await self.repo.get_by_id(enquiry_id)

    async def create_enquiry(self, data: Dict[str, Any]):
        enquiry = await self.repo.create(data)
        logger.info("Enquiry created", extra={"structured": {"email": data.get("email")}})
        return enquiry

    async def update_status(self, enquiry_id: str, status: str, notes: Optional[str] = None):
        data: Dict[str, Any] = {"status": status}
        if notes is not None:
            data["notes"] = notes
        return await self.repo.update(enquiry_id, data)

    async def delete_enquiry(self, enquiry_id: str):
        return await self.repo.soft_delete(enquiry_id)

    async def get_stats(self) -> Dict[str, int]:
        """Return aggregated enquiry statistics."""
        now = datetime.now(timezone.utc)
        seven_days_ago = now - timedelta(days=7)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        # Base filter: exclude soft-deleted
        base = Enquiry.is_deleted == False  # noqa: E712

        # Total count
        total_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(base)
        )
        total = total_result.scalar_one()

        # Count by status
        new_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(base, Enquiry.status == "new")
        )
        new_count = new_result.scalar_one()

        contacted_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(base, Enquiry.status == "contacted")
        )
        contacted_count = contacted_result.scalar_one()

        resolved_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(base, Enquiry.status == "resolved")
        )
        resolved_count = resolved_result.scalar_one()

        # Recent (last 7 days)
        recent_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(
                base, Enquiry.created_at >= seven_days_ago
            )
        )
        recent_count = recent_result.scalar_one()

        # Today
        today_result = await self.session.execute(
            select(func.count()).select_from(Enquiry).where(
                base, Enquiry.created_at >= today_start
            )
        )
        today_count = today_result.scalar_one()

        return {
            "total": total,
            "new": new_count,
            "contacted": contacted_count,
            "resolved": resolved_count,
            "recent": recent_count,
            "today": today_count,
        }
