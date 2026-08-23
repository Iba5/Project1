"""
Global error handler middleware.
Returns RFC 7807 Problem Details JSON responses.
"""

from __future__ import annotations

import traceback

from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from pydantic import ValidationError

from app.core.logging import logger
from app.schemas.common import ErrorResponse


def register_error_handlers(app: FastAPI) -> None:
    """Attach global exception handlers to the FastAPI app."""

    @app.exception_handler(ValidationError)
    async def validation_error_handler(request: Request, exc: ValidationError):
        logger.warning("Validation error", extra={"structured": {"detail": str(exc)}})
        is_production = getattr(request.app.state, "environment", None) == "production"
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content=ErrorResponse(
                type="validation-error",
                title="Validation Error",
                status=422,
                detail="There was a problem with your request." if is_production else str(exc),
                instance=str(request.url.path),
            ).model_dump(),
        )

    @app.exception_handler(ValueError)
    async def value_error_handler(request: Request, exc: ValueError):
        logger.warning("Value error", extra={"structured": {"detail": str(exc)}})
        is_production = getattr(request.app.state, "environment", None) == "production"
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content=ErrorResponse(
                type="business-error",
                title="Business Error",
                status=400,
                detail="There was a problem with your request." if is_production else str(exc),
                instance=str(request.url.path),
            ).model_dump(),
        )

    @app.exception_handler(PermissionError)
    async def permission_error_handler(request: Request, exc: PermissionError):
        logger.warning("Permission denied", extra={"structured": {"detail": str(exc)}})
        is_production = getattr(request.app.state, "environment", None) == "production"
        return JSONResponse(
            status_code=status.HTTP_403_FORBIDDEN,
            content=ErrorResponse(
                type="permission-denied",
                title="Permission Denied",
                status=403,
                detail="You don't have permission to do that." if is_production else str(exc),
                instance=str(request.url.path),
            ).model_dump(),
        )

    @app.exception_handler(Exception)
    async def generic_error_handler(request: Request, exc: Exception):
        logger.error(
            "Unhandled exception",
            extra={"structured": {"detail": str(exc), "traceback": traceback.format_exc()}},
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content=ErrorResponse(
                type="internal-error",
                title="Internal Server Error",
                status=500,
                detail="An unexpected error occurred" if getattr(request.app.state, "environment", None) == "production" else str(exc),
                instance=str(request.url.path),
            ).model_dump(),
        )
