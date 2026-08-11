"""
Media upload endpoint — accepts an image file and uploads it to Cloudinary.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File

from app.core.storage import upload_file
from app.dependencies.auth import require_permission
from app.models.user import User
from app.permissions.rbac import Permission

router = APIRouter()

MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB — small-business site, not high-volume media
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}


@router.post("/upload")
async def upload_media(
    file: UploadFile = File(...),
    _user: User = Depends(require_permission(Permission.GALLERY_WRITE)),
):
    if file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: jpeg, png, webp, gif.",
        )

    contents = await file.read()
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=400, detail="File too large. Maximum size is 5MB.")
    if not contents:
        raise HTTPException(status_code=400, detail="Empty file.")

    result = upload_file(contents, content_type=file.content_type, folder="canbri")
    return {
        "url": result["url"],
        "key": result["key"],
        "bytes": result["bytes"],
    }
