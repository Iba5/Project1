"""Add is_out_of_stock to catalogue_items.

Revision ID: 0002_catalogue_stock_status
Revises: 0001_initial
Create Date: 2026-08-09

"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic
revision: str = "0002_catalogue_stock_status"
down_revision = "0001_initial"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "catalogue_items",
        sa.Column("is_out_of_stock", sa.Boolean, nullable=False, server_default="false"),
    )


def downgrade() -> None:
    op.drop_column("catalogue_items", "is_out_of_stock")
