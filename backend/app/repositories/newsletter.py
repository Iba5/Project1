"""
Newsletter subscriber repository.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.newsletter import NewsletterSubscriber
from app.repositories.base import BaseRepository


class NewsletterRepository(BaseRepository[NewsletterSubscriber]):
    def __init__(self, session: AsyncSession):
        super().__init__(NewsletterSubscriber, session)

    async def get_by_email(self, email: str) -> NewsletterSubscriber | None:
        """Find a subscriber by email address."""
        stmt = select(self.model).where(
            self.model.email == email,
            self.model.is_deleted == False,  # noqa: E712
        )
        result = await self.session.execute(stmt)
        return result.scalar_one_or_none()
