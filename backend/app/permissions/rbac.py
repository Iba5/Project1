"""
RBAC (Role-Based Access Control) utilities.

Permission hierarchy:
  super_admin > admin > editor > viewer

Each role inherits the permissions of the roles below it.
"""

from __future__ import annotations

from enum import Enum
from functools import lru_cache
from typing import Dict, FrozenSet, Set


class Role(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    EDITOR = "editor"
    VIEWER = "viewer"


# ── Permission definitions ────────────────────────────────────────
class Permission(str, Enum):
    # Catalogue
    CATALOGUE_READ = "catalogue:read"
    CATALOGUE_WRITE = "catalogue:write"
    CATALOGUE_DELETE = "catalogue:delete"

    # Enquiries
    ENQUIRY_READ = "enquiry:read"
    ENQUIRY_WRITE = "enquiry:write"
    ENQUIRY_DELETE = "enquiry:delete"

    # CMS
    CMS_READ = "cms:read"
    CMS_WRITE = "cms:write"
    CMS_PUBLISH = "cms:publish"
    CMS_DELETE = "cms:delete"

    # Gallery
    GALLERY_READ = "gallery:read"
    GALLERY_WRITE = "gallery:write"
    GALLERY_DELETE = "gallery:delete"

    # Settings
    SETTINGS_READ = "settings:read"
    SETTINGS_WRITE = "settings:write"

    # Users
    USER_MANAGE = "user:manage"


# ── Role → Permission mapping ────────────────────────────────────
ROLE_PERMISSIONS: Dict[Role, FrozenSet[Permission]] = {
    Role.SUPER_ADMIN: frozenset(Permission),  # All permissions
    Role.ADMIN: frozenset({
        Permission.CATALOGUE_READ, Permission.CATALOGUE_WRITE, Permission.CATALOGUE_DELETE,
        Permission.ENQUIRY_READ, Permission.ENQUIRY_WRITE, Permission.ENQUIRY_DELETE,
        Permission.CMS_READ, Permission.CMS_WRITE, Permission.CMS_PUBLISH, Permission.CMS_DELETE,
        Permission.GALLERY_READ, Permission.GALLERY_WRITE, Permission.GALLERY_DELETE,
        Permission.SETTINGS_READ, Permission.SETTINGS_WRITE,
        Permission.USER_MANAGE,
    }),
    Role.EDITOR: frozenset({
        Permission.CATALOGUE_READ, Permission.CATALOGUE_WRITE,
        Permission.ENQUIRY_READ, Permission.ENQUIRY_WRITE,
        Permission.CMS_READ, Permission.CMS_WRITE,
        Permission.GALLERY_READ, Permission.GALLERY_WRITE,
        Permission.SETTINGS_READ,
    }),
    Role.VIEWER: frozenset({
        Permission.CATALOGUE_READ,
        Permission.ENQUIRY_READ,
        Permission.CMS_READ,
        Permission.GALLERY_READ,
        Permission.SETTINGS_READ,
    }),
}


def has_permission(role: str, permission: str) -> bool:
    """Check if a role has a specific permission."""
    try:
        role_enum = Role(role)
        perm_enum = Permission(permission)
        return perm_enum in ROLE_PERMISSIONS[role_enum]
    except (ValueError, KeyError):
        return False


def get_role_permissions(role: str) -> Set[str]:
    """Get all permissions for a given role."""
    try:
        role_enum = Role(role)
        return {p.value for p in ROLE_PERMISSIONS[role_enum]}
    except (ValueError, KeyError):
        return set()
