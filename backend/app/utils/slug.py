"""
Slug generation utilities.
"""

from __future__ import annotations

import re
import unicodedata


def generate_slug(text: str) -> str:
    """
    Convert text to a URL-friendly slug.

    Examples:
        "Tools & Hardware" → "tools-and-hardware"
        "PPE" → "ppe"
        "Ice Blocks" → "ice-blocks"
    """
    # Normalize unicode
    text = unicodedata.normalize("NFKD", text)
    # Lowercase
    text = text.lower()
    # Replace non-alphanumeric with hyphens
    text = re.sub(r"[^a-z0-9]+", "-", text)
    # Remove leading/trailing hyphens
    text = text.strip("-")
    # Collapse multiple hyphens
    text = re.sub(r"-{2,}", "-", text)
    return text


def unique_slug(text: str, existing_slugs: list[str]) -> str:
    """
    Generate a slug that doesn't conflict with existing slugs.
    Appends a numeric suffix if necessary.
    """
    base = generate_slug(text)
    slug = base
    counter = 1
    while slug in existing_slugs:
        slug = f"{base}-{counter}"
        counter += 1
    return slug
