"""
Pagination dependency: extract limit/offset from query params.
"""

from __future__ import annotations

from fastapi import Query

from app.core.config import settings
from app.schemas.common import PaginationParams


def get_pagination_params(
    limit: int = Query(
        default=settings.DEFAULT_PAGE_LIMIT,
        ge=1,
        le=settings.MAX_PAGE_LIMIT,
        description="Number of items per page",
    ),
    offset: int = Query(
        default=0,
        ge=0,
        description="Number of items to skip",
    ),
) -> PaginationParams:
    return PaginationParams(limit=limit, offset=offset)
