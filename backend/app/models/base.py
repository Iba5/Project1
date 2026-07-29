"""
SQLAlchemy declarative base and common mixins.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, String, event
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class Base(DeclarativeBase):
    """Declarative base for all models."""
    pass


class TimestampMixin:
    """
    Common mixin that adds audit columns to every model.
    Uses String(36) for UUID primary keys so SQLite stays compatible.
    """

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    is_deleted: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )
    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
        default=None,
    )
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)
    updated_by: Mapped[str | None] = mapped_column(String(36), nullable=True)


class VersionedMixin(TimestampMixin):
    """Adds optimistic locking via a version counter."""

    version: Mapped[int] = mapped_column(
        default=1,
        nullable=False,
    )


# ── Auto-update `updated_at` on flush ─────────────────────────────
@event.listens_for(Base, "before_update", propagate=True)
def _on_before_update(_mapper, _connection, target: Base) -> None:
    if hasattr(target, "updated_at"):
        target.updated_at = datetime.now(timezone.utc)
