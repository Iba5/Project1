"""
Catalogue models: Category and CatalogueItem.
"""

from __future__ import annotations

from enum import Enum as PyEnum

from sqlalchemy import Boolean, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, VersionedMixin


class CatalogueItemStatus(str, PyEnum):
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class Category(TimestampMixin, Base):
    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    items: Mapped[list["CatalogueItem"]] = relationship(
        "CatalogueItem", back_populates="category", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<Category {self.name!r}>"


class CatalogueItem(VersionedMixin, Base):
    __tablename__ = "catalogue_items"

    name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    category_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("categories.id"), nullable=True
    )
    short_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    long_description: Mapped[str | None] = mapped_column(Text, nullable=True)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    gallery_image_urls: Mapped[list | None] = mapped_column(JSON, nullable=True)
    is_featured: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_out_of_stock: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    features: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    specs: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    min_order: Mapped[str | None] = mapped_column(String(100), nullable=True)
    lead_time: Mapped[str | None] = mapped_column(String(100), nullable=True)
    rating: Mapped[float | None] = mapped_column(nullable=True, default=None)
    review_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    status: Mapped[str] = mapped_column(
        String(50),
        default=CatalogueItemStatus.DRAFT.value,
        nullable=False,
    )

    category: Mapped["Category | None"] = relationship(
        "Category", back_populates="items", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<CatalogueItem {self.name!r}>"
