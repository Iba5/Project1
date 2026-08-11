"""Add gallery_image_urls to catalogue_items.

Revision ID: 0003_catalogue_gallery_images
Revises: 0002_catalogue_stock_status
Create Date: 2026-08-09

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision: str = "0003_catalogue_gallery_images"
down_revision = "0002_catalogue_stock_status"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "catalogue_items",
        sa.Column("gallery_image_urls", sa.JSON, nullable=True),
    )


def downgrade() -> None:
    op.drop_column("catalogue_items", "gallery_image_urls")
