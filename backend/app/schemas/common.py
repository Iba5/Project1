"""
Common schemas: pagination, error shapes, sorting.
"""

from __future__ import annotations

from typing import Generic, List, Optional, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


# ── Pagination ────────────────────────────────────────────────────
class PaginationParams(BaseModel):
    limit: int = Field(default=20, ge=1, le=100)
    offset: int = Field(default=0, ge=0)


class PaginatedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    limit: int
    offset: int


# ── Sorting ───────────────────────────────────────────────────────
class SortParams(BaseModel):
    sort_by: Optional[str] = Field(default=None, description="Field name to sort by")
    sort_order: Optional[str] = Field(
        default="asc", pattern="^(asc|desc)$", description="Sort direction"
    )


# ── RFC 7807 Error ────────────────────────────────────────────────
class ErrorResponse(BaseModel):
    type: str = Field(default="about:blank", description="Error type URI")
    title: str = Field(..., description="Short human-readable summary")
    status: int = Field(..., description="HTTP status code")
    detail: Optional[str] = Field(default=None, description="Specific explanation")
    instance: Optional[str] = Field(default=None, description="Request path")


# ── Misc ──────────────────────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
