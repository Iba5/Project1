"""
Newsletter service.
"""

from __future__ import annotations

from typing import Any, Dict

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import logger
from app.repositories.newsletter import NewsletterRepository


class NewsletterService:
    def __init__(self, session: AsyncSession):
        self.session = session
        self.repo = NewsletterRepository(session)

    async def subscribe(self, data: Dict[str, Any]) -> Dict[str, str]:
        """Subscribe an email to the newsletter. Idempotent — returns existing if already subscribed."""
        email = data.get("email", "").strip().lower()
        source = data.get("source", "footer_form")

        existing = await self.repo.get_by_email(email)
        if existing:
            return {"message": "Already subscribed", "email": email}

        await self.repo.create({"email": email, "source": source})
        logger.info("Newsletter subscription", extra={"structured": {"email": email}})
        return {"message": "Subscribed successfully", "email": email}
