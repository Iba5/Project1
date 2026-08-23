"""
Media upload endpoint — accepts an image file, compresses it server-side,
and uploads it to Cloudflare R2.
"""

from __future__ import annotations

import io

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from PIL import Image

from app.core.storage import upload_file
from app.dependencies.auth import require_permission
from app.models.user import User
from app.permissions.rbac import Permission

router = APIRouter()

MAX_UPLOAD_BYTES = 5 * 1024 * 1024  # 5MB — small-business site, not high-volume media
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}

MAX_DIMENSION = 1920  # longest edge, px — plenty for a product photo, no more
JPEG_QUALITY = 82
WEBP_QUALITY = 82


def _compress_image(contents: bytes, content_type: str) -> tuple[bytes, str]:
    """Resize to a sane max dimension and re-encode. Preserves transparency
    for images that have it (keeps PNG), otherwise re-encodes as JPEG."""
    image = Image.open(io.BytesIO(contents))
    image.load()

    if image.width > MAX_DIMENSION or image.height > MAX_DIMENSION:
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.LANCZOS)

    has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)

    buffer = io.BytesIO()
    if content_type == "image/gif":
        # Animated GIFs would lose frames if re-encoded through Pillow's
        # default save path — leave them untouched.
        return contents, content_type
    if has_alpha:
        image = image.convert("RGBA")
        image.save(buffer, format="PNG", optimize=True)
        return buffer.getvalue(), "image/png"

    image = image.convert("RGB")
    image.save(buffer, format="JPEG", quality=JPEG_QUALITY, optimize=True)
    return buffer.getvalue(), "image/jpeg"


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

    try:
        compressed, out_content_type = _compress_image(contents, file.content_type)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not process image file.")

    result = upload_file(compressed, content_type=out_content_type, folder="canbri")
    return {
        "url": result["url"],
        "key": result["key"],
        "bytes": result["bytes"],
    }
