# Canbri Platform

**Premium industrial supplies for Zimbabwe — Tools, Hardware, PPE, Stationery, Ice Blocks & Fabrication**

Canbri Private Limited is a Zimbabwean company supplying businesses and households across Harare and Murewa. This repository contains the full-stack web platform: a Next.js 16 frontend with a FastAPI (Python) backend.

---

## Architecture

```
┌─────────────────────┐       ┌──────────────────────┐
│   Next.js 16 (SSR)  │──────▶│  FastAPI Backend      │
│   Port 3000         │ API   │  Port 3001            │
│                     │ Proxy │                       │
│  - App Router       │◀──────│  - REST API (v1)      │
│  - React 19         │       │  - SQLAlchemy 2.0     │
│  - Tailwind CSS 4   │       │  - SQLite / Postgres  │
│  - shadcn/ui        │       │  - JWT Auth           │
└─────────────────────┘       └──────────────────────┘
```

The Next.js frontend proxies API requests to the FastAPI backend via server-side API routes (`src/app/api/`). This means the browser only talks to Next.js, and Next.js forwards requests to FastAPI internally — no CORS issues, no exposed backend port.

### API Proxy & Lazy-Start

The `api-proxy.ts` utility includes a **lazy-start mechanism**: if the FastAPI service is down when a request comes in, the proxy automatically attempts to start it and retries the request. This makes the system resilient to FastAPI crashes or restarts.

### Static Data Fallback

The CMS adapter (`src/lib/cms/`) currently uses static data from `src/content/`. This means the frontend renders correctly even when FastAPI is completely down. The admin dashboard, contact form, and newsletter form are connected to FastAPI; product data and CMS content use static fallbacks.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router & SSR |
| **React 19** | UI library |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Pre-built accessible UI components (Radix) |
| **Framer Motion** | Animations & transitions |
| **Zustand** | Lightweight state management |
| **React Hook Form + Zod** | Form handling & validation |
| **Recharts** | Charts for admin dashboard |
| **Lucide React** | Icon library |
| **next-themes** | Dark mode support |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Python async web framework |
| **SQLAlchemy 2.0** | Async ORM |
| **Alembic** | Database migrations |
| **Pydantic v2** | Data validation & settings |
| **Uvicorn** | ASGI server |
| **Argon2** | Password hashing |
| **PyJWT** | JWT token generation |

### Database
- **Development**: SQLite (`mini-services/api/canbri.db`)
- **Production**: PostgreSQL (via `CANBRI_DATABASE_URL` env var)

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm (comes with Node.js)
- Python 3.12+
- pip

### 1. Clone & Install Frontend

```bash
cd /path/to/project
npm install
```

### 2. Set Up FastAPI Backend

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the API server
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 3001
```

The API will auto-seed on first startup, creating:
- Admin user: `admin@canbri.co.zw` / `admin123`
- 5 product categories, 5 catalogue items
- 11 settings, 3 CMS pages, 8 gallery items

### 3. Start the Frontend

```bash
# From project root
npm run dev
```

The frontend runs on **http://localhost:3000**. API proxy routes will automatically forward requests to FastAPI on port 3001.

### 4. Access the Admin Dashboard

Open **http://localhost:3000** and scroll to the bottom — click the admin link in the footer, or navigate directly to the admin dashboard component. Login with:

- **Email**: `admin@canbri.co.zw`
- **Password**: `admin123`

---

## Project Structure

```
my-project/
├── src/
│   ├── app/
│   │   ├── api/                    # Next.js API routes (proxy to FastAPI)
│   │   │   ├── contact/route.ts    #   POST /api/contact → enquiries
│   │   │   ├── catalogue/route.ts  #   GET /api/catalogue → catalogue items
│   │   │   ├── settings/route.ts   #   GET /api/settings → site settings
│   │   │   ├── newsletter/route.ts #   POST /api/newsletter → subscribe
│   │   │   └── admin/
│   │   │       ├── enquiries/route.ts  # GET/PATCH/DELETE enquiries
│   │   │       └── stats/route.ts      # GET enquiry stats
│   │   ├── layout.tsx              # Root layout (theme, fonts, metadata)
│   │   ├── page.tsx                # Homepage (single-page site)
│   │   └── globals.css             # Global styles & Tailwind config
│   ├── components/
│   │   ├── website/                # Business components
│   │   │   ├── hero-section.tsx
│   │   │   ├── product-filter.tsx
│   │   │   ├── product-card.tsx
│   │   │   ├── contact-form.tsx
│   │   │   ├── gallery-lightbox.tsx
│   │   │   ├── faq-section.tsx
│   │   │   ├── awards-section.tsx
│   │   │   ├── admin-dashboard.tsx
│   │   │   └── ... (40+ components)
│   │   └── ui/                     # shadcn/ui primitives
├── frontend/
│   ├── app/                    # Next.js App Router (pages & API proxy routes)
│   ├── components/             # React components (UI & website)
│   ├── content/                # Static content fallbacks (products, CMS data)
│   ├── hooks/                  # Custom React hooks
│   └── lib/                    # Utilities, API proxy, CMS abstraction layer
├── backend/
│   ├── app/                    # FastAPI application core
│   │   ├── api/v1/             # API route endpoints
│   │   ├── core/               # Config, logging, security
│   │   ├── dependencies/       # FastAPI dependencies (auth, DB, pagination)
│   │   ├── middleware/         # CORS, rate limiting, security headers
│   │   ├── models/             # SQLAlchemy models
│   │   ├── repositories/       # Data access layer
│   │   ├── schemas/            # Pydantic validation schemas
│   │   └── services/           # Business logic layer
│   ├── alembic/                # Database migration scripts
│   ├── tests/                  # Pytest test suite
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Container definition
│   ├── docker-compose.yml      # Service orchestrations
│   ├── canbri.db               # SQLite database (auto-created)
│   ├── alembic.ini
│   └── .env                    # Backend environment vars
├── public/                         # Static assets (images, SVGs)
├── .env.example                    # Environment variable template
├── .gitignore
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── Caddyfile                       # Production reverse proxy config
```

---

## Environment Variables

### Frontend (project root)

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | `file:/home/z/my-project/db/custom.db` | Legacy DB URL (not used by FastAPI) |

> The frontend uses Next.js API routes which proxy to FastAPI at `http://localhost:3001`. This is hardcoded in `api-proxy.ts` and does not need an environment variable.

### Backend (`mini-services/api/.env`)

| Variable | Default | Description |
|---|---|---|
| `CANBRI_DATABASE_URL` | `sqlite+aiosqlite:///canbri.db` | SQLAlchemy async database URL |
| `REDIS_URL` | *(empty)* | Redis URL for caching (empty = in-memory fallback) |
| `JWT_SECRET_KEY` | `change-me-in-production` | Secret key for JWT tokens |
| `JWT_ALGORITHM` | `HS256` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `15` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | `7` | Refresh token lifetime |
| `CORS_ORIGINS` | `["http://localhost:3000"]` | Allowed CORS origins (JSON array) |
| `ENVIRONMENT` | `local` | `local` / `staging` / `production` |

> **Important**: Change `JWT_SECRET_KEY` before deploying to production.

---

## How the Frontend Connects to FastAPI

```
Browser → Next.js (port 3000) → API Route → api-proxy.ts → FastAPI (port 3001)
```

1. **Browser** makes a request to `/api/contact`, `/api/catalogue`, etc.
2. **Next.js API Route** (`src/app/api/*/route.ts`) receives the request
3. **api-proxy.ts** forwards it to `http://localhost:3001/api/v1/...`
4. **FastAPI** processes the request and returns JSON
5. **api-proxy.ts** returns the response to the Next.js API route
6. **Next.js** sends the response back to the browser

### API Route Mapping

| Next.js Route | FastAPI Endpoint | Method |
|---|---|---|
| `/api/contact` | `/api/v1/enquiries` | POST |
| `/api/catalogue` | `/api/v1/catalogue/items` | GET |
| `/api/settings` | `/api/v1/settings` | GET |
| `/api/newsletter` | `/api/v1/newsletter/subscribe` | POST |
| `/api/admin/enquiries` | `/api/v1/enquiries` | GET/PATCH/DELETE |
| `/api/admin/stats` | `/api/v1/enquiries/stats` | GET |

### Lazy-Start Mechanism

If the FastAPI service is not running when a request arrives:
1. `api-proxy.ts` detects the connection failure
2. It spawns the FastAPI process: `uvicorn app.main:app --port 3001`
3. It polls the `/health` endpoint for up to 15 seconds
4. Once healthy, it retries the original request
5. If startup fails, it returns the original error to the client

---

## Admin Credentials

| Field | Value |
|---|---|
| **Email** | `admin@canbri.co.zw` |
| **Password** | `admin123` |

> These are seeded on first FastAPI startup. Change the password in production.

---

## Available Scripts

### Frontend
```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build (standalone output)
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
cd backend

# Start development server
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 3001 --reload

# Start production server
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 3001

# Run Alembic migrations
./venv/bin/alembic upgrade head

# API docs (when running)
# Swagger UI: http://localhost:3001/docs
# ReDoc:      http://localhost:3001/redoc
```

---

## Production Deployment

The `Caddyfile` at the project root provides a reverse proxy configuration for production. The Next.js app is built with `output: "standalone"` for minimal Docker images.

```bash
# Build the frontend
npm run build

# Start the standalone server
NODE_ENV=production node .next/standalone/server.js

# Start the backend
cd backend
./venv/bin/python -m uvicorn app.main:app --host 0.0.0.0 --port 3001
```

---

## Known Issues

1. **OOM in constrained environments**: Running Next.js (~1.2GB), FastAPI (~85MB), and a browser simultaneously can exceed 4GB RAM. The lazy-start mechanism mitigates this.
2. **Static data**: CMS and product data use static fallbacks from `src/content/`. These can be connected to FastAPI endpoints for dynamic content management.
3. **No admin login flow**: The admin dashboard is accessible but does not yet have a proper login gate. The admin dashboard component fetches data from the API but authentication is handled at the API level.

---

## License

Proprietary — Canbri Private Limited
