"""
Gallery models: MediaItem, MediaCollection, MediaCollectionItem.
"""

from __future__ import annotations

from sqlalchemy import ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin


class MediaItem(TimestampMixin, Base):
    __tablename__ = "media_items"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    alt_text: Mapped[str | None] = mapped_column(String(255), nullable=True)
    file_url: Mapped[str] = mapped_column(String(500), nullable=False)
    file_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
    file_size: Mapped[int | None] = mapped_column(Integer, nullable=True)
    mime_type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True)

    collections: Mapped[list["MediaCollectionItem"]] = relationship(
        "MediaCollectionItem", back_populates="media_item", lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<MediaItem {self.title!r}>"


class MediaCollection(TimestampMixin, Base):
    __tablename__ = "media_collections"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    items: Mapped[list["MediaCollectionItem"]] = relationship(
        "MediaCollectionItem", back_populates="collection", lazy="selectin",
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<MediaCollection {self.name!r}>"


class MediaCollectionItem(Base):
    """Association table linking media items to collections."""
    __tablename__ = "media_collection_items"

    collection_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("media_collections.id"), primary_key=True
    )
    media_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("media_items.id"), primary_key=True
    )
    sort_order: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    collection: Mapped["MediaCollection"] = relationship(
        "MediaCollection", back_populates="items"
    )
    media_item: Mapped["MediaItem"] = relationship(
        "MediaItem", back_populates="collections"
    )

    def __repr__(self) -> str:
        return f"<MediaCollectionItem col={self.collection_id!r} media={self.media_id!r}>"
