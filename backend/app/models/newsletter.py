"""
Newsletter subscriber model.
"""

from __future__ import annotations

from sqlalchemy import String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, TimestampMixin


class NewsletterSubscriber(TimestampMixin, Base):
    __tablename__ = "newsletter_subscribers"
    __table_args__ = (
        UniqueConstraint("email", name="uq_newsletter_email"),
    )

    email: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    source: Mapped[str] = mapped_column(
        String(50), default="footer_form", nullable=False
    )

    def __repr__(self) -> str:
        return f"<NewsletterSubscriber {self.email!r}>"
