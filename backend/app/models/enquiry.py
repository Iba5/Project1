"""
Enquiry model.
"""

from __future__ import annotations

from enum import Enum as PyEnum

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class EnquiryStatus(str, PyEnum):
    NEW = "new"
    CONTACTED = "contacted"
    RESOLVED = "resolved"
    CLOSED = "closed"


class EnquirySource(str, PyEnum):
    CONTACT_FORM = "contact_form"
    QUOTE_WIZARD = "quote_wizard"
    WHATSAPP = "whatsapp"


class Enquiry(TimestampMixin, Base):
    __tablename__ = "enquiries"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    company: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    product_id: Mapped[str | None] = mapped_column(
        String(36), ForeignKey("catalogue_items.id"), nullable=True
    )
    product_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    message: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(50), default=EnquiryStatus.NEW.value, nullable=False
    )
    source: Mapped[str] = mapped_column(
        String(50), default=EnquirySource.CONTACT_FORM.value, nullable=False
    )
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __repr__(self) -> str:
        return f"<Enquiry {self.name!r} ({self.status})>"
