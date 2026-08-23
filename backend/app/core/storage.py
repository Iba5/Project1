"""
Cloudflare R2 media storage (S3-compatible API via boto3).
"""

from __future__ import annotations

import mimetypes
import uuid

import boto3
from botocore.client import Config

from app.core.config import settings

_client = None


def _get_client():
    global _client
    if _client is None:
        _client = boto3.client(
            "s3",
            endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
            aws_access_key_id=settings.R2_ACCESS_KEY_ID,
            aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
            config=Config(signature_version="s3v4"),
            region_name="auto",
        )
    return _client


def upload_file(file_bytes: bytes, *, content_type: str, folder: str = "canbri") -> dict:
    """Upload raw bytes to R2 and return {"url": ..., "key": ..., "bytes": ...}."""
    ext = mimetypes.guess_extension(content_type) or ""
    key = f"{folder}/{uuid.uuid4().hex}{ext}"

    client = _get_client()
    client.put_object(
        Bucket=settings.R2_BUCKET_NAME,
        Key=key,
        Body=file_bytes,
        ContentType=content_type,
    )

    public_base = settings.R2_PUBLIC_URL.rstrip("/")
    return {
        "url": f"{public_base}/{key}",
        "key": key,
        "bytes": len(file_bytes),
    }


def get_bucket_usage_bytes() -> int:
    """Sum the size of every object in the R2 bucket (paginated list_objects_v2)."""
    client = _get_client()
    total = 0
    continuation_token: str | None = None
    while True:
        kwargs = {"Bucket": settings.R2_BUCKET_NAME}
        if continuation_token:
            kwargs["ContinuationToken"] = continuation_token
        page = client.list_objects_v2(**kwargs)
        for obj in page.get("Contents", []):
            total += obj["Size"]
        if not page.get("IsTruncated"):
            break
        continuation_token = page.get("NextContinuationToken")
    return total
