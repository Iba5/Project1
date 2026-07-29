# Canbri Platform Backend

REST API for the Canbri Private Limited web platform, built with **FastAPI** and **SQLAlchemy 2.0** (async). Serves the product catalogue, enquiry management, CMS, gallery, newsletter, and site settings — all behind JWT-based authentication with role-based access control.

---

## Architecture Overview

The service follows a clean **layered architecture** pattern:

```
Request → Router → Service → Repository → Model → Database
```

| Layer          | Responsibility                                         |
| -------------- | ------------------------------------------------------ |
| **Router**     | HTTP endpoint definitions, request validation (schemas) |
| **Service**    | Business logic, orchestration, caching                  |
| **Repository** | Database queries, data access abstraction               |
| **Model**      | SQLAlchemy ORM models, table definitions                |
| **Schema**     | Pydantic models for request/response validation         |

### Cross-cutting Concerns

| Concern        | Implementation                                          |
| -------------- | ------------------------------------------------------- |
| **Auth**       | JWT (access + refresh tokens), Argon2 password hashing   |
| **RBAC**       | Permission hierarchy: `super_admin > admin > editor > viewer` |
| **Caching**    | Redis (if configured) or in-memory with TTL fallback     |
| **Middleware** | CORS, request logging, global error handler              |
| **WebSocket**  | Connection manager for real-time notifications (ready)   |
| **Migrations** | Alembic with async support                               |

---

## Folder Structure

```
api/
├── alembic.ini                  # Alembic configuration
├── canbri.db                    # SQLite database (local dev)
├── watchdog.sh                  # Process watchdog script
├── app/
│   ├── main.py                  # FastAPI app entry point, lifespan
│   ├── api/
│   │   └── v1/
│   │       ├── router.py        # Aggregated v1 router
│   │       ├── auth.py          # Auth endpoints
│   │       ├── catalogue.py     # Catalogue endpoints
│   │       ├── cms.py           # CMS endpoints
│   │       ├── enquiries.py     # Enquiry endpoints
│   │       ├── gallery.py       # Gallery endpoints
│   │       ├── health.py        # Health check
│   │       ├── newsletter.py    # Newsletter endpoints
│   │       └── settings.py      # Settings endpoints
│   ├── cache/
│   │   └── manager.py           # Redis / in-memory cache manager
│   ├── core/
│   │   ├── config.py            # pydantic-settings configuration
│   │   ├── logging.py           # Structured logging
│   │   └── security.py          # Password hashing, JWT creation/validation
│   ├── dependencies/
│   │   ├── auth.py              # get_current_user, require_admin, require_editor
│   │   ├── database.py          # Async SQLAlchemy session dependency
│   │   └── pagination.py        # Pagination parameter dependency
│   ├── events/
│   │   └── handlers.py          # Startup/shutdown event handlers
│   ├── middleware/
│   │   ├── cors.py              # CORS middleware setup
│   │   ├── error_handler.py     # Global exception handlers
│   │   └── logging.py           # Request logging middleware
│   ├── migrations/
│   │   └── env.py               # Alembic async migration environment
│   ├── models/
│   │   ├── base.py              # Declarative base, TimestampMixin, VersionedMixin
│   │   ├── user.py              # User model (roles, lockout)
│   │   ├── catalogue.py         # Category, CatalogueItem models
│   │   ├── enquiry.py           # Enquiry model
│   │   ├── cms.py               # Page, ContentBlock, PageVersion models
│   │   ├── gallery.py           # MediaItem, MediaCollection models
│   │   ├── settings.py          # Setting model (key-value store)
│   │   └── newsletter.py        # NewsletterSubscriber model
│   ├── permissions/
│   │   └── rbac.py              # Role/permission definitions and helpers
│   ├── repositories/
│   │   ├── base.py              # Base repository with CRUD helpers
│   │   ├── user.py              # User data access
│   │   ├── catalogue.py         # Catalogue data access
│   │   ├── enquiry.py           # Enquiry data access
│   │   ├── cms.py               # CMS data access
│   │   ├── gallery.py           # Gallery data access
│   │   ├── settings.py          # Settings data access
│   │   └── newsletter.py        # Newsletter data access
│   ├── schemas/
│   │   ├── common.py            # PaginatedResponse, shared schemas
│   │   ├── auth.py              # Auth request/response schemas
│   │   ├── catalogue.py         # Catalogue schemas
│   │   ├── enquiry.py           # Enquiry schemas
│   │   ├── cms.py               # CMS schemas
│   │   ├── gallery.py           # Gallery schemas
│   │   ├── settings.py          # Settings schemas
│   │   └── newsletter.py        # Newsletter schemas
│   ├── services/
│   │   ├── auth.py              # Auth business logic
│   │   ├── catalogue.py         # Catalogue business logic
│   │   ├── enquiry.py           # Enquiry business logic
│   │   ├── cms.py               # CMS business logic
│   │   ├── gallery.py           # Gallery business logic
│   │   ├── settings.py          # Settings business logic
│   │   └── newsletter.py        # Newsletter business logic
│   ├── tasks/
│   │   └── seed.py              # Database seed script
│   ├── utils/
│   │   └── slug.py              # Slug generation utilities
│   └── websocket/
│       └── manager.py           # WebSocket connection manager
├── tests/
│   ├── conftest.py              # Pytest fixtures (async client, test DB)
│   └── __init__.py
├── venv/                        # Python virtual environment
├── .env                         # Environment variables (git-ignored)
├── .env.example                 # Environment variable template
├── .gitignore                   # Git ignore rules
├── Dockerfile                   # Production Docker image
├── docker-compose.yml           # Docker Compose for local dev/production
└── requirements.txt             # Python dependencies
```

---

## Quick Start

### Prerequisites

- Python 3.12+
- SQLite (built-in) or PostgreSQL for production

### 1. Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Database Migrations

```bash
alembic upgrade head
```

### 4. Seed the Database

The seed script runs automatically on startup. To run it manually:

```bash
python -m app.tasks.seed
```

### 5. Start the Server

```bash
# Development
uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload

# Production
uvicorn app.main:app --host 0.0.0.0 --port 3001 --workers 4
```

The API will be available at `http://localhost:3001`.  
Interactive docs (Swagger UI) at `http://localhost:3001/docs` (disabled in production).  
ReDoc at `http://localhost:3001/redoc` (disabled in production).

---

## API Endpoints Reference

All endpoints are prefixed with `/api/v1` unless otherwise noted.

### Health

| Method | Path          | Auth | Description                |
| ------ | ------------- | ---- | -------------------------- |
| GET    | `/health`     | None | Root health check          |
| GET    | `/api/v1/health` | None | Health + DB connectivity check |

### Auth

| Method | Path                          | Auth | Description                     |
| ------ | ----------------------------- | ---- | ------------------------------- |
| POST   | `/api/v1/auth/login`          | None | Authenticate user, return JWT tokens |
| POST   | `/api/v1/auth/register`       | None | Register a new user             |
| POST   | `/api/v1/auth/refresh`        | None | Exchange refresh token for new access/refresh pair |
| POST   | `/api/v1/auth/forgot-password`| None | Request password reset link     |
| POST   | `/api/v1/auth/reset-password` | None | Reset password with reset token |
| GET    | `/api/v1/auth/me`             | Bearer | Get current user profile       |

### Catalogue

| Method | Path                              | Auth  | Description                     |
| ------ | --------------------------------- | ----- | ------------------------------- |
| GET    | `/api/v1/catalogue/categories`    | None  | List categories (paginated)     |
| POST   | `/api/v1/catalogue/categories`    | Admin | Create a new category           |
| GET    | `/api/v1/catalogue/items`         | None  | List items (paginated, filterable) |
| GET    | `/api/v1/catalogue/items/{id}`    | None  | Get a single item               |
| POST   | `/api/v1/catalogue/items`         | Admin | Create a new catalogue item     |
| PATCH  | `/api/v1/catalogue/items/{id}`    | Admin | Update a catalogue item         |
| DELETE | `/api/v1/catalogue/items/{id}`    | Admin | Delete a catalogue item         |

### Enquiries

| Method | Path                                  | Auth  | Description                     |
| ------ | ------------------------------------- | ----- | ------------------------------- |
| GET    | `/api/v1/enquiries`                   | Admin | List enquiries (paginated, filterable) |
| GET    | `/api/v1/enquiries/stats`             | Admin | Get aggregated enquiry statistics |
| GET    | `/api/v1/enquiries/{id}`              | Admin | Get a single enquiry            |
| POST   | `/api/v1/enquiries`                   | None  | Submit a new enquiry (public)   |
| PATCH  | `/api/v1/enquiries/{id}/status`       | Admin | Update enquiry status           |
| DELETE | `/api/v1/enquiries/{id}`              | Admin | Delete an enquiry               |

### CMS

| Method | Path                                    | Auth  | Description                     |
| ------ | --------------------------------------- | ----- | ------------------------------- |
| GET    | `/api/v1/cms/pages`                     | None  | List pages (paginated, filterable) |
| GET    | `/api/v1/cms/pages/{slug}`              | None  | Get a page by slug or ID        |
| POST   | `/api/v1/cms/pages`                     | Admin | Create a new page               |
| PATCH  | `/api/v1/cms/pages/{id}`                | Admin | Update a page                   |
| POST   | `/api/v1/cms/pages/{id}/publish`        | Admin | Publish a page                  |
| POST   | `/api/v1/cms/pages/{id}/archive`        | Admin | Archive a page                  |
| GET    | `/api/v1/cms/pages/{id}/versions`       | Admin | List page version history       |
| POST   | `/api/v1/cms/pages/{id}/rollback`       | Admin | Rollback to a previous version  |

### Gallery

| Method | Path                               | Auth  | Description                     |
| ------ | ---------------------------------- | ----- | ------------------------------- |
| GET    | `/api/v1/gallery/items`            | None  | List media items (paginated)    |
| GET    | `/api/v1/gallery/items/{id}`       | None  | Get a single media item         |
| POST   | `/api/v1/gallery/items`            | Admin | Create a media item             |
| DELETE | `/api/v1/gallery/items/{id}`       | Admin | Delete a media item             |
| GET    | `/api/v1/gallery/collections`      | None  | List collections (paginated)    |
| POST   | `/api/v1/gallery/collections`      | Admin | Create a collection             |

### Settings

| Method | Path                         | Auth  | Description                     |
| ------ | ---------------------------- | ----- | ------------------------------- |
| GET    | `/api/v1/settings`           | None  | Get public site settings        |
| GET    | `/api/v1/settings/all`       | Admin | Get all settings                |
| PATCH  | `/api/v1/settings/{key}`     | Admin | Update a setting by key         |

### Newsletter

| Method | Path                              | Auth | Description                     |
| ------ | --------------------------------- | ---- | ------------------------------- |
| POST   | `/api/v1/newsletter/subscribe`    | None | Subscribe to the newsletter     |

---

## Admin Credentials

The seed script creates a default admin user:

| Field    | Value                  |
| -------- | ---------------------- |
| Email    | `admin@canbri.co.zw`  |
| Password | `admin123`             |
| Role     | `super_admin`          |

> **Important:** Change these credentials in production. Set a strong `JWT_SECRET_KEY` and update the admin password.

---

## Environment Variables Reference

| Variable                       | Default                                 | Description                                      |
| ------------------------------ | --------------------------------------- | ------------------------------------------------ |
| `APP_NAME`                     | `Canbri API`                            | Application name                                 |
| `APP_VERSION`                  | `1.0.0`                                 | Application version                              |
| `ENVIRONMENT`                  | `local`                                 | Environment: `local`, `staging`, `production`    |
| `DEBUG`                        | `True`                                  | Enable debug mode                                |
| `CANBRI_DATABASE_URL`          | `sqlite+aiosqlite:///canbri.db`         | SQLAlchemy async database URL                    |
| `REDIS_URL`                    | _(empty)_                               | Redis URL; empty = in-memory cache fallback      |
| `JWT_SECRET_KEY`               | `change-me-in-production`               | Secret key for JWT signing                       |
| `JWT_ALGORITHM`                | `HS256`                                 | JWT signing algorithm                            |
| `ACCESS_TOKEN_EXPIRE_MINUTES`  | `15`                                    | Access token lifetime in minutes                 |
| `REFRESH_TOKEN_EXPIRE_DAYS`    | `7`                                     | Refresh token lifetime in days                   |
| `CORS_ORIGINS`                 | `["http://localhost:3000"]`             | Allowed CORS origins (JSON array or comma-separated) |
| `DEFAULT_PAGE_LIMIT`           | `20`                                    | Default pagination page size                     |
| `MAX_PAGE_LIMIT`               | `100`                                   | Maximum pagination page size                     |
| `MAX_FAILED_LOGIN_ATTEMPTS`    | `5`                                     | Failed login attempts before account lockout     |
| `ACCOUNT_LOCK_MINUTES`         | `30`                                    | Account lockout duration in minutes              |

---

## Testing

### Run Tests

```bash
# Activate the virtual environment
source venv/bin/activate

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run a specific test file
pytest tests/test_auth.py
```

### Test Configuration

Tests use an **in-memory SQLite** database (`sqlite+aiosqlite://`) that is created and dropped for each test. The `conftest.py` file provides:

- `event_loop` — session-scoped asyncio event loop
- `setup_database` — creates/drops tables per test
- `db_session` — async database session fixture
- `client` — `httpx.AsyncClient` with the app's dependency overrides

### Manual API Testing

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@canbri.co.zw","password":"admin123"}'

# Use the access token for authenticated requests
curl http://localhost:3001/api/v1/enquiries \
  -H "Authorization: Bearer <access_token>"
```

---

## Deployment

### Docker

Build and run the Docker image:

```bash
# Build
docker build -t canbri-api .

# Run
docker run -d \
  --name canbri-api \
  -p 3001:3001 \
  -e ENVIRONMENT=production \
  -e JWT_SECRET_KEY=your-strong-secret-key \
  -e CANBRI_DATABASE_URL=sqlite+aiosqlite:///./canbri.db \
  canbri-api
```

### Docker Compose

```bash
docker compose up -d
```

This starts the API service with an optional Redis container for caching.

### Production Checklist

- [ ] Set `ENVIRONMENT=production` (disables Swagger/ReDoc docs)
- [ ] Set a strong `JWT_SECRET_KEY` (minimum 32 characters)
- [ ] Change the default admin password
- [ ] Configure `CORS_ORIGINS` to only allow your frontend domain
- [ ] Use PostgreSQL instead of SQLite for production workloads
- [ ] Set `REDIS_URL` for distributed caching
- [ ] Set `DEBUG=False`
- [ ] Run behind a reverse proxy (nginx, Caddy) with TLS
- [ ] Set up Alembic migrations for schema changes
- [ ] Configure health check monitoring on `/health`

### Database Migrations

```bash
# Create a new migration
alembic revision --autogenerate -m "description of changes"

# Apply migrations
alembic upgrade head

# Rollback one migration
alembic downgrade -1
```

---

## License

Proprietary — Canbri Private Limited
