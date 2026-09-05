"""
Seed script: populate the database with initial data.

Safety contract
---------------
* Never calls Base.metadata.create_all — schema is owned by Alembic.
* Never creates a super-admin account — that only ever happens via the
  one-time /auth/register bootstrap signup, gated by a real "no admin
  exists yet" database check. Standing credentials in env vars or
  deploy logs are not an acceptable way to provision an admin.
* Exits gracefully if the tables don't exist yet (run `alembic upgrade head` first).
"""

from __future__ import annotations

import asyncio
import sys

# Ensure the project root is on the path
sys.path.insert(0, ".")

from app.dependencies.database import engine, async_session_factory
from app.models.base import Base
from app.models.catalogue import Category, CatalogueItem
from app.models.enquiry import Enquiry
from app.models.cms import Page, ContentBlock
from app.models.gallery import MediaItem, MediaCollection
from app.models.settings import Setting

from sqlalchemy import select


# ── Seed data ─────────────────────────────────────────────────────

CATEGORIES = [
    {"name": "Tools & Hardware", "slug": "tools-and-hardware", "description": "Hand tools, power tools, fasteners and builders' hardware", "is_active": True, "sort_order": 1},
    {"name": "Fabrication", "slug": "fabrication", "description": "Mild-steel and stainless fabrication, gates, frames, brackets", "is_active": True, "sort_order": 2},
    {"name": "PPE", "slug": "ppe", "description": "Personal protective equipment, safety wear, gloves, eyewear", "is_active": True, "sort_order": 3},
    {"name": "Stationery", "slug": "stationery", "description": "Office and school stationery, printer consumables", "is_active": True, "sort_order": 4},
    {"name": "Ice Blocks", "slug": "ice-blocks", "description": "Manufactured ice blocks for commercial, retail and events", "is_active": True, "sort_order": 5},
]

CATALOGUE_ITEMS: list[dict] = []


GALLERY_ITEMS: list[dict] = []
SITE_SETTINGS = [
    {"key": "site_name", "value": "Canbri Private Limited", "description": "Company name"},
    {"key": "site_description", "value": "Canbri Private Limited supplies tools and hardware, fabrication services, personal protective equipment, stationery and ice blocks. We serve businesses and households across Harare and Murewa with reliable delivery and bulk-order support.", "description": "Site meta description"},
    {"key": "site_email", "value": "Canbrifinance@gmail.com", "description": "Contact email"},
    {"key": "site_phone", "value": "+263 71 427 8269", "description": "Phone number"},
    {"key": "site_whatsapp", "value": "+263 77 327 8269", "description": "WhatsApp number"},
    {"key": "site_url", "value": "https://canbri.co.zw", "description": "Website URL"},
    {"key": "site_address", "value": "", "description": "Business street address"},
    {"key": "business_hours", "value": "Mon – Fri: 08:00 – 17:00 · Sat: 08:00 – 13:00 · Sun: Closed", "description": "Business hours"},
    {"key": "delivery_areas", "value": ["Harare", "Murewa"], "description": "Delivery areas"},
    {"key": "founding_year", "value": 2024, "description": "Founding year"},
    {"key": "social_facebook", "value": "https://www.facebook.com/canbri", "description": "Facebook URL"},
    {"key": "social_instagram", "value": "https://www.instagram.com/canbri", "description": "Instagram URL"},
    {"key": "tagline", "value": "Cool & Cold", "description": "Company tagline"},
    {"key": "short_name", "value": "Canbri", "description": "Short company name"},
    {"key": "db_storage_limit_mb", "value": "", "description": "Database storage limit (MB) — admin-set plan ceiling, blank = unknown"},
    {"key": "image_storage_limit_mb", "value": "", "description": "Image/R2 storage limit (MB) — admin-set plan ceiling, blank = unknown"},
]

CMS_PAGES = [
    {"title": "Homepage", "slug": "homepage", "status": "published"},
    {"title": "About Us", "slug": "about", "status": "published"},
    {"title": "Contact", "slug": "contact", "status": "published"},
]


async def seed() -> None:
    """Run the full seed process."""
    from app.core.logging import logger
    from sqlalchemy import text
    from sqlalchemy.exc import ProgrammingError

    # Guard: ensure tables exist (i.e. alembic upgrade head has been run)
    try:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1 FROM users LIMIT 1"))
    except ProgrammingError:
        logger.error(
            "[seed] Table 'users' does not exist. Run `alembic upgrade head` first."
        )
        return
    except Exception as exc:
        logger.error(f"[seed] Cannot connect to database: {exc}")
        return

    async with async_session_factory() as session:
        # The super-admin account is never seeded here — it's created once via
        # the /auth/register bootstrap signup, gated by a real "no admin
        # exists yet" database check.

        # ── Categories ────────────────────────────────────────────
        category_map: dict[str, str] = {}
        for cat_data in CATEGORIES:
            result = await session.execute(select(Category).where(Category.slug == cat_data["slug"]))
            cat = result.scalar_one_or_none()
            if not cat:
                cat = Category(**cat_data)
                session.add(cat)
                await session.flush()
                logger.info(f"Category created: {cat_data['slug']}")
            category_map[cat.slug] = cat.id

        # ── Catalogue items ──────────────────────────────────────
        for item_data in CATALOGUE_ITEMS:
            category_slug = item_data.pop("category_slug")
            result = await session.execute(select(CatalogueItem).where(CatalogueItem.slug == item_data["slug"]))
            item = result.scalar_one_or_none()
            if not item:
                item_data["category_id"] = category_map.get(category_slug)
                item = CatalogueItem(**item_data)
                session.add(item)
                logger.info(f"Catalogue item created: {item_data['slug']}")

        # ── Gallery items ────────────────────────────────────────
        for g_data in GALLERY_ITEMS:
            result = await session.execute(select(MediaItem).where(MediaItem.file_url == g_data["file_url"]))
            if not result.scalar_one_or_none():
                session.add(MediaItem(**g_data))

        # ── Settings ─────────────────────────────────────────────
        # Stored as the natural JSON value (string/number/array) — matching
        # what PATCH /settings/{key} writes — not wrapped in {"value": ...}.
        for s_data in SITE_SETTINGS:
            result = await session.execute(select(Setting).where(Setting.key == s_data["key"]))
            if not result.scalar_one_or_none():
                session.add(Setting(key=s_data["key"], value=s_data["value"], description=s_data.get("description")))

        # ── CMS pages ────────────────────────────────────────────
        for p_data in CMS_PAGES:
            result = await session.execute(select(Page).where(Page.slug == p_data["slug"]))
            if not result.scalar_one_or_none():
                session.add(Page(**p_data))

        await session.commit()
        logger.info("Seed completed successfully")


if __name__ == "__main__":
    asyncio.run(seed())
