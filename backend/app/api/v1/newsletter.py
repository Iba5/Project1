"""
Newsletter endpoints.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db_session
from app.schemas.newsletter import NewsletterSubscribe
from app.services.newsletter import NewsletterService

router = APIRouter()


@router.post("/subscribe")
async def subscribe(
    body: NewsletterSubscribe,
    session: AsyncSession = Depends(get_db_session),
):
    """Public endpoint — subscribe to the newsletter."""
    svc = NewsletterService(session)
    return await svc.subscribe(body.model_dump(exclude_unset=True))
