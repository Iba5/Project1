"""
CMS models: Page, ContentBlock, PageVersion.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, VersionedMixin


class PageStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Page(VersionedMixin, Base):
    __tablename__ = "pages"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    status: Mapped[str] = mapped_column(
        String(50), default=PageStatus.DRAFT.value, nullable=False
    )
    published_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    blocks: Mapped[list["ContentBlock"]] = relationship(
        "ContentBlock", back_populates="page", lazy="selectin",
        cascade="all, delete-orphan",
    )
    versions: Mapped[list["PageVersion"]] = relationship(
        "PageVersion", back_populates="page", lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Page {self.slug!r}>"


class ContentBlock(TimestampMixin, Base):
    __tablename__ = "content_blocks"

    page_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pages.id"), nullable=False
    )
    block_type: Mapped[str] = mapped_column(String(100), nullable=False)
    content: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    page: Mapped["Page"] = relationship("Page", back_populates="blocks")

    def __repr__(self) -> str:
        return f"<ContentBlock page={self.page_id!r} type={self.block_type!r}>"


class PageVersion(TimestampMixin, Base):
    __tablename__ = "page_versions"

    page_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("pages.id"), nullable=False
    )
    version_number: Mapped[int] = mapped_column(Integer, nullable=False)
    snapshot: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    created_by: Mapped[str | None] = mapped_column(String(36), nullable=True)

    page: Mapped["Page"] = relationship("Page", back_populates="versions")

    def __repr__(self) -> str:
        return f"<PageVersion page={self.page_id!r} v{self.version_number}>"
