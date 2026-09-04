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

CATALOGUE_ITEMS = [
    {
        "name": "Tools & Hardware",
        "slug": "tools-and-hardware",
        "category_slug": "tools-and-hardware",
        "short_description": "Hand tools, power tools, fasteners and builders' hardware for tradespeople, contractors and home users.",
        "long_description": "A dependable range of hand tools, power tools, fasteners and builders' hardware, sourced from trusted manufacturers. Stocked for tradespeople, contractors, retail hardware stores and household projects. Bulk orders and recurring supply for sites are welcome.",
        "is_featured": True,
        "features": [
            "Hand tools: hammers, screwdrivers, spanners, pliers, saws",
            "Power tools: drills, grinders, circular saws, rotary hammers",
            "Fasteners: nails, screws, bolts, anchors, rivets",
            "Builders' hardware: hinges, locks, handles, brackets",
            "Bulk site supply & recurring orders welcome",
        ],
        "specs": [
            {"label": "Categories", "value": "Hand tools, Power tools, Fasteners, Hardware"},
            {"label": "Brands", "value": "Mixed trusted regional brands"},
            {"label": "Min order", "value": "Single item to full site kit"},
            {"label": "Lead time", "value": "In-stock items same day, indent 3–7 days"},
        ],
        "min_order": "Single item",
        "lead_time": "Same day for stock items",
        "status": "published",
    },
    {
        "name": "Fabrication",
        "slug": "fabrication",
        "category_slug": "fabrication",
        "short_description": "Mild-steel and stainless fabrication, gates, frames, brackets and custom structural work.",
        "long_description": "Custom metal fabrication in mild and stainless steel: gates, window frames, brackets, stairs, railings and structural components. Built to spec from drawings or site measurements, with finishing and delivery available across Harare and Murewa.",
        "is_featured": True,
        "features": [
            "Mild steel & stainless steel fabrication",
            "Gates, window frames, burglar bars, brackets",
            "Stairs, railings & structural components",
            "Built to spec from drawings or site measurements",
            "Finishing, treatment & delivery available",
        ],
        "specs": [
            {"label": "Materials", "value": "Mild steel, stainless steel"},
            {"label": "Process", "value": "Cut, weld, grind, finish, paint"},
            {"label": "Min order", "value": "Single custom item"},
            {"label": "Lead time", "value": "3–10 working days by complexity"},
        ],
        "min_order": "Single item",
        "lead_time": "3–10 working days",
        "status": "published",
    },
    {
        "name": "PPE",
        "slug": "ppe",
        "category_slug": "ppe",
        "short_description": "Personal protective equipment, safety wear, gloves, eyewear, footwear and respiratory protection.",
        "long_description": "Personal protective equipment for industrial, construction, food-handling and healthcare settings. Coveralls, high-visibility wear, safety gloves, protective eyewear, safety footwear and respiratory protection. Supplied in case and bulk quantities with ongoing contracts available.",
        "is_featured": True,
        "features": [
            "Coveralls & high-visibility wear",
            "Safety gloves: cut-resistant, chemical, general purpose",
            "Protective eyewear & face shields",
            "Safety footwear with steel toe caps",
            "Respiratory protection: masks & cartridges",
        ],
        "specs": [
            {"label": "Standards", "value": "Regional safety standards aligned"},
            {"label": "Pack sizes", "value": "Single, case, bulk pallet"},
            {"label": "Contracts", "value": "Standing supply orders available"},
            {"label": "Lead time", "value": "Stock items same day"},
        ],
        "min_order": "Single item",
        "lead_time": "Same day for stock items",
        "status": "published",
    },
    {
        "name": "Stationery",
        "slug": "stationery",
        "category_slug": "stationery",
        "short_description": "Office and school stationery, printer consumables and writing supplies in bulk.",
        "long_description": "General office and school stationery, printer consumables, writing instruments, paper products and filing supplies. Ideal for offices, schools, retailers and procurement teams. Bulk pricing and standing orders are supported.",
        "is_featured": True,
        "features": [
            "Office & school stationery supplies",
            "Printer consumables: toner, ink, drums",
            "Writing instruments & paper products",
            "Filing, binding & archival supplies",
            "Bulk pricing & standing orders supported",
        ],
        "specs": [
            {"label": "Categories", "value": "Office, School, Printer consumables"},
            {"label": "Pack sizes", "value": "Single to carton quantities"},
            {"label": "Contracts", "value": "School & office termly supply"},
            {"label": "Lead time", "value": "1–3 working days"},
        ],
        "min_order": "Single item",
        "lead_time": "1–3 working days",
        "status": "published",
    },
    {
        "name": "Ice Blocks",
        "slug": "ice-blocks",
        "category_slug": "ice-blocks",
        "short_description": "Manufactured ice blocks for commercial, retail and events use, delivered cold across Harare and Murewa.",
        "long_description": "Manufactured ice blocks produced under hygienic conditions and supplied to restaurants, hotels, bars, supermarkets, fisheries, caterers, event organisers and households. Delivered cold across Harare and Murewa. Bulk orders and recurring deliveries are welcome.",
        "is_featured": True,
        "features": [
            "Manufactured ice blocks under hygienic conditions",
            "Restaurants, hotels, bars & supermarkets",
            "Fisheries, caterers & event organisers",
            "Bulk orders & recurring deliveries welcome",
            "Cold-chain delivery across Harare & Murewa",
        ],
        "specs": [
            {"label": "Format", "value": "Block ice, crushed ice on request"},
            {"label": "Min order", "value": "Single block to bulk pallet"},
            {"label": "Delivery", "value": "Cold-chain, Harare & Murewa"},
            {"label": "Lead time", "value": "Same day for orders before 12:00"},
        ],
        "min_order": "Single block",
        "lead_time": "Same day (orders before 12:00)",
        "status": "published",
    },
]

GALLERY_ITEMS = [
    {"title": "Canbri Facility", "alt_text": "Canbri production and dispatch facility", "file_url": "/gallery/factory.png", "file_type": "image", "category": "Factory"},
    {"title": "Ice Production", "alt_text": "Ice block manufacturing under hygienic conditions", "file_url": "/gallery/production.png", "file_type": "image", "category": "Production"},
    {"title": "Packaging", "alt_text": "Sealed, labelled and ready for cold-chain dispatch", "file_url": "/gallery/packaging.png", "file_type": "image", "category": "Packaging"},
    {"title": "Deliveries", "alt_text": "Daily delivery routes across Harare and Murewa", "file_url": "/gallery/deliveries.png", "file_type": "image", "category": "Deliveries"},
    {"title": "Tools & Hardware", "alt_text": "Hand tools, power tools and builders' hardware range", "file_url": "/gallery/tools.png", "file_type": "image", "category": "Products"},
    {"title": "PPE Range", "alt_text": "Protective wear, gloves, eyewear and footwear", "file_url": "/gallery/ppe.png", "file_type": "image", "category": "Products"},
    {"title": "Fabrication Work", "alt_text": "Gates, frames, brackets and structural fabrication", "file_url": "/gallery/fabrication.png", "file_type": "image", "category": "Products"},
    {"title": "Stationery", "alt_text": "Office and school stationery supplies", "file_url": "/gallery/stationery.png", "file_type": "image", "category": "Products"},
]

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
