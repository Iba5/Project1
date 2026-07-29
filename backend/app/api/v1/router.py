"""
Aggregated v1 router.
"""

from __future__ import annotations

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.catalogue import router as catalogue_router
from app.api.v1.cms import router as cms_router
from app.api.v1.enquiries import router as enquiries_router
from app.api.v1.gallery import router as gallery_router
from app.api.v1.health import router as health_router
from app.api.v1.newsletter import router as newsletter_router
from app.api.v1.settings import router as settings_router

router = APIRouter()

router.include_router(health_router, tags=["Health"])
router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(catalogue_router, prefix="/catalogue", tags=["Catalogue"])
router.include_router(enquiries_router, prefix="/enquiries", tags=["Enquiries"])
router.include_router(cms_router, prefix="/cms", tags=["CMS"])
router.include_router(gallery_router, prefix="/gallery", tags=["Gallery"])
router.include_router(newsletter_router, prefix="/newsletter", tags=["Newsletter"])
router.include_router(settings_router, prefix="/settings", tags=["Settings"])
