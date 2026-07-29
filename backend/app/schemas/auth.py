"""
Auth schemas: login, register, token, user profile.
All fields include proper validation so FastAPI returns 422 with clear messages
before the request ever reaches the service layer.
"""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator


# ── Login ─────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(
        min_length=1,
        description="Account password",
    )


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserPublic"


# ── Register ──────────────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: EmailStr
    name: str = Field(min_length=2, max_length=255, description="Full name")
    password: str = Field(
        min_length=8,
        max_length=128,
        description="Password (min 8 characters)",
    )
    role: Optional[str] = "viewer"

    @field_validator("role")
    @classmethod
    def validate_role(cls, v: str | None) -> str:
        allowed = {"super_admin", "admin", "editor", "viewer"}
        if v and v not in allowed:
            raise ValueError(f"role must be one of: {', '.join(sorted(allowed))}")
        return v or "viewer"

    @field_validator("password")
    @classmethod
    def validate_password_strength(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


# ── Token ─────────────────────────────────────────────────────────
class RefreshRequest(BaseModel):
    refresh_token: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# ── Forgot / Reset ────────────────────────────────────────────────
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


class ResetPasswordRequest(BaseModel):
    token: str = Field(min_length=1)
    new_password: str = Field(
        min_length=8,
        max_length=128,
        description="New password (min 8 characters)",
    )

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, v: str) -> str:
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit")
        return v


# ── User profile ─────────────────────────────────────────────────
class UserPublic(BaseModel):
    id: str
    email: str
    name: str
    role: str
    is_active: bool
    is_verified: bool
    last_login_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=255)
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    is_active: Optional[bool] = None
