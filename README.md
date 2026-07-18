# AI Sales & Engagement Chatbot with SAP Integration

> **DhifafBot** — A production-grade, AI-powered beauty commerce chatbot that integrates with SAP for live pricing & stock, serves customers across Facebook Messenger, Instagram, and WhatsApp, and provides a real-time admin dashboard.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Folder Structure](#folder-structure)
5. [Prerequisites](#prerequisites)
6. [Quick Start (Docker)](#quick-start-docker)
7. [Development Setup](#development-setup)
8. [Environment Variables](#environment-variables)
9. [Database Setup & Migrations](#database-setup--migrations)
10. [AI System](#ai-system)
11. [SAP Integration](#sap-integration)
12. [Meta Webhooks](#meta-webhooks)
13. [API Overview](#api-overview)
14. [Authentication](#authentication)
15. [Production Deployment](#production-deployment)
16. [Nginx & SSL](#nginx--ssl)
17. [Background Jobs & Cron](#background-jobs--cron)
18. [Security](#security)
19. [Performance](#performance)
20. [Monitoring & Logging](#monitoring--logging)
21. [Backup & Restore](#backup--restore)
22. [Troubleshooting](#troubleshooting)
23. [Improvement Roadmap](#improvement-roadmap)
24. [Known Issues](#known-issues)
25. [Contributing](#contributing)

---

## Project Overview

DhifafBot is a full-stack SaaS application built for a premium beauty & fragrance retailer in Iraq. It:

- **Receives messages** from Facebook Messenger, Instagram DMs, and WhatsApp via Meta Cloud API webhooks
- **Routes conversations** through an AI-powered sales assistant ("Dhifaf") built on OpenAI GPT-4o/GPT-4o-mini
- **Syncs product catalog** bi-daily from SAP (price, stock) while protecting editorial content from overwrite
- **Delivers recommendations** via a hybrid AI scoring engine (semantic similarity + editorial + popularity + stock + freshness)
- **Manages handoffs** between AI and human agents with a full state machine
- **Exposes an admin dashboard** (React SPA) for managing products, knowledge base, brands, categories, and conversations

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Internet / CDN                               │
└─────────────┬───────────────────────┬───────────────────────────────┘
              │ HTTPS                 │ Webhooks (FB/IG/WA)
              ▼                       ▼
┌─────────────────────┐   ┌──────────────────────┐
│  nginx (prod)       │   │  Meta Cloud API       │
│  SSL termination    │   │  (Facebook/Instagram/ │
│  Rate limiting      │   │   WhatsApp)           │
└────────┬────────────┘   └──────────┬────────────┘
         │                            │
    ┌────▼────────────────────────────▼──────────┐
    │          Backend Service (Django 6)          │
    │  - JWT Authentication (SimpleJWT)            │
    │  - REST API (DRF)                            │
    │  - Webhook receiver & dispatcher             │
    │  - AI Proxy (forwards dashboard calls)       │
    │  - Conversation history (SQLite)             │
    │  - Agent handoff management                  │
    └────────────────────────┬────────────────────┘
                             │ HTTP (internal)
                             ▼
    ┌────────────────────────────────────────────┐
    │          AI Service (FastAPI + Gunicorn)    │
    │  - GPT-4o / GPT-4o-mini (model router)     │
    │  - RAG pipeline (pgvector knowledge base)   │
    │  - Product search & recommendations         │
    │  - SAP sync scheduler (cron)                │
    │  - Embedding pipeline (nightly)             │
    │  - Circuit breaker (OpenAI protection)      │
    │  - Redis cache layer                        │
    └────────┬───────────────┬────────────────────┘
             │               │
    ┌────────▼──────┐  ┌─────▼──────────┐
    │  PostgreSQL   │  │     Redis       │
    │  + pgvector   │  │  Cache + TTL    │
    └───────────────┘  └────────────────┘
                             ▲
                             │ External
    ┌────────────────────────┴────────────────────┐
    │  SAP ERP (OData REST /getItems)             │
    │  → Bi-daily price/stock sync                │
    └─────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────┐
    │  Frontend (React 19 + Vite + Tailwind 4)    │
    │  Served by nginx:80                         │
    │  → Admin dashboard (JWT protected)          │
    └─────────────────────────────────────────────┘
```

### Data Flow: Incoming Customer Message
```
Meta Webhook POST → Backend /webhook/
  → WebhookParser.parse_*_event()
  → ConversationMessage saved (SQLite)
  → threading.Thread(_trigger_bot_reply)
    → BotService.get_bot_reply() → POST http://ai:8000/reply
      → AsyncChatOrchestrator.run()
        → ModelRouter (gpt-4o-mini vs gpt-4o)
        → RAG retrieval (pgvector)
        → Tool loop (search_products, get_recommendations, ...)
        → GPT response
    → MetaApiService.send_message() → Meta Graph API
```

---

## Technology Stack

| Layer | Technology | Version |
|---|---|---|
| **AI Service** | FastAPI | Latest |
| | Gunicorn + UvicornWorker | Latest |
| | OpenAI Python SDK | ≥1.0.0 |
| | SQLAlchemy | Latest |
| | pgvector | Latest |
| | Alembic | Latest |
| | APScheduler | Latest |
| | tiktoken | Latest |
| | pypdf | Latest |
| | Redis (redis-py) | Latest |
| | httpx | Latest |
| **Backend** | Django | 6.0.3 |
| | Django REST Framework | 3.16.1 |
| | SimpleJWT | 5.5.1 |
| | django-cors-headers | 4.9.0 |
| | drf-yasg | 1.21.15 (Swagger) |
| | WhiteNoise | 6.11.0 |
| | python-decouple | 3.8 |
| | Gunicorn | 23.0.0 |
| **Frontend** | React | 19.2.0 |
| | Vite | 7.3.1 |
| | TailwindCSS | 4.2.1 |
| | React Router | 7.13.1 |
| | TanStack Query | 5.x |
| | Axios | 1.x |
| | Recharts | 3.x |
| | DaisyUI | 5.x |
| **Database** | PostgreSQL | 17 + pgvector |
| | SQLite | 3.x (backend auth/conversations) |
| **Cache** | Redis | 7-alpine |
| **Proxy** | nginx | 1.27-alpine |
| **Container** | Docker + Docker Compose | Latest |
| **AI Models** | GPT-4o (complex turns) | OpenAI |
| | GPT-4o-mini (simple turns) | OpenAI |
| | text-embedding-3-small | OpenAI |

---

## Folder Structure

```
project_47_AI Sales & Engagement Chatbot with SAP Integration/
├── docker-compose.yml          # Standard deployment
├── docker-compose.prod.yml     # Production (nginx, resource limits)
├── docker-compose.dev.yml      # Development (hot reload)
├── nginx/
│   └── nginx.prod.conf         # Production nginx config
│
├── AI/                         # FastAPI AI Service
│   ├── Dockerfile              # Development image
│   ├── Dockerfile.prod         # Multi-stage production image
│   ├── .env.example            # Environment template
│   ├── .dockerignore
│   ├── requirements.txt
│   ├── main.py                 # FastAPI app, routers, scheduler
│   ├── models.py               # SQLAlchemy ORM models
│   ├── database.py             # Backward-compat shim → core/database.py
│   ├── tools.py                # (legacy tool definitions)
│   ├── system_prompt.txt       # Dhifaf AI personality prompt
│   ├── alembic.ini             # Migration config
│   │
│   ├── ai/                     # AI engine
│   │   ├── orchestrator.py     # Async chat pipeline (V2)
│   │   ├── model_router.py     # gpt-4o vs gpt-4o-mini routing
│   │   ├── prompt_manager.py   # System prompt assembly
│   │   ├── rag_service.py      # pgvector RAG retrieval
│   │   ├── message_builder.py  # OpenAI messages array builder
│   │   ├── token_budget.py     # Token counting + trimming
│   │   ├── tool_registry.py    # Tool definitions + executor
│   │   └── tools/              # Individual tool implementations
│   │       ├── product_search.py
│   │       ├── formatters.py
│   │       └── availability.py
│   │
│   ├── api/routes/             # FastAPI route handlers
│   │   ├── chat.py             # POST /reply
│   │   ├── products.py         # CRUD + bulk operations
│   │   ├── categories.py
│   │   ├── brands.py
│   │   ├── subcategories.py
│   │   ├── bundles.py
│   │   ├── recommendations.py
│   │   ├── ai_recommendations.py
│   │   ├── knowledge.py        # RAG knowledge base upload
│   │   ├── uploads.py          # Excel product import
│   │   ├── export.py           # Excel export
│   │   ├── handoff.py          # Human-agent handoff
│   │   └── system.py           # /ready, /health, /rate, /prompt
│   │
│   ├── core/                   # Shared infrastructure
│   │   ├── config.py           # Settings singleton
│   │   ├── database.py         # Engine + session factory
│   │   ├── circuit_breaker.py  # OpenAI circuit breaker
│   │   ├── rate_limiter.py     # Per-user rate limiting
│   │   ├── logging_config.py   # Structured logging setup
│   │   ├── exceptions.py       # Custom exception classes
│   │   ├── image_utils.py      # Image processing (HEIF→JPEG)
│   │   └── recommendation_context.py
│   │
│   ├── services/               # Business logic layer
│   │   ├── sync.py             # SAP bi-daily sync
│   │   ├── embedding.py        # OpenAI embedding pipeline
│   │   ├── vector_search.py    # pgvector similarity search
│   │   ├── cache_service.py    # Redis cache operations
│   │   ├── recommendation.py   # Rule-based recommender
│   │   ├── ai_recommendation.py# Hybrid AI recommender
│   │   ├── recommendation_cache.py
│   │   ├── scoring.py          # Product scoring engine
│   │   ├── upload.py           # Excel import processor
│   │   ├── knowledge_service.py# RAG document processor
│   │   ├── handoff_service.py  # Handoff state machine
│   │   ├── chat_service.py     # Chat history management
│   │   ├── conversation_summary.py
│   │   ├── bundle.py           # Bundle operations
│   │   ├── excel_export_service.py
│   │   ├── normalization.py    # Entity normalization
│   │   ├── status.py           # Product status service
│   │   └── lead_service.py     # Lead registration
│   │
│   ├── repositories/
│   │   └── product.py          # Product repository (DB queries)
│   │
│   ├── schemas/                # Pydantic request/response models
│   │   ├── product.py
│   │   ├── upload.py
│   │   ├── ai_recommendation.py
│   │   ├── status.py
│   │   └── export_columns.py
│   │
│   ├── alembic/                # Database migrations
│   │   ├── env.py
│   │   └── versions/           # 13 migration files (2026-05 → 2026-06)
│   │
│   ├── knowledge_base/         # Uploaded RAG documents (volume)
│   ├── static/                 # Static assets
│   └── tests/                  # Test suite
│
├── backend/                    # Django REST Backend
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   ├── .env.example
│   ├── requirements.txt
│   ├── manage.py
│   ├── Switch2onlin677/        # Django project config
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── accounts/               # User auth (JWT)
│   ├── conversation/           # Meta webhook handler + message store
│   ├── ai_proxy/               # Authenticated proxy → AI service
│   ├── agent_manage/           # Human agent management
│   ├── api/                    # Core API endpoints
│   ├── dashboard/              # Dashboard views
│   └── leads/                  # Lead capture
│
└── frontend/                   # React 19 Admin Dashboard
    ├── Dockerfile
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── api/                # Axios API client
        ├── components/         # Reusable UI components
        ├── pages/              # Route-level pages
        ├── hooks/              # Custom React hooks
        ├── layout/             # App shell / navigation
        ├── route/              # React Router config
        └── utils/              # Helpers
```

---

## Prerequisites

- Docker ≥ 24.0
- Docker Compose ≥ 2.20
- (Dev only) Node.js 20+, Python 3.12+
- OpenAI API key with GPT-4o access
- SAP OData endpoint (for price/stock sync)
- Meta Developer App (Facebook/Instagram/WhatsApp)

---

## Quick Start (Docker)

```bash
# 1. Clone the repository
git clone <repo-url>
cd "project_47_AI Sales & Engagement Chatbot with SAP Integration"

# 2. Create the external PostgreSQL volume (one-time)
docker volume create ai_postgres_data

# 3. Set up environment files
cp AI/.env.example AI/.env
cp backend/.env.example backend/.env

# 4. Edit both .env files with your credentials
#    Minimum required:
#      AI/.env:       OPENAI_API_KEY, DATABASE_URL, REDIS_URL
#      backend/.env:  SECRET_KEY, AI_BOT_BASE_URL, all EMAIL_* vars

# 5. Start all services
docker compose up -d --build

# 6. View logs
docker compose logs -f

# Services available at:
#   Frontend:  http://localhost:8003
#   Backend:   http://localhost:8010
#   API Docs:  http://localhost:8010/swagger/
```

---

## Development Setup

```bash
# Start development stack (hot reload on all services)
docker compose -f docker-compose.dev.yml up --build

# Services:
#   Frontend:      http://localhost:5173  (Vite HMR)
#   Backend:       http://localhost:8010  (Django runserver)
#   AI Service:    http://localhost:8000  (uvicorn --reload)
#   PostgreSQL:    localhost:5432
#   Redis:         localhost:6379
```

### Local Python development (AI service)
```bash
cd AI
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # fill in values
uvicorn main:app --reload --port 8000
```

### Local Python development (Backend)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 8010
```

### Local Frontend development
```bash
cd frontend
npm install
# Set VITE_API_URL in .env.local
npm run dev
```

---

## Environment Variables

### AI Service (`AI/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `OPENAI_API_KEY` | ✅ | — | OpenAI API key (GPT-4o + embedding) |
| `DATABASE_URL` | ✅ | SQLite fallback | PostgreSQL connection string |
| `REDIS_URL` | ⬜ | — | Redis URL (caching disabled if missing) |
| `SAP_API_URL` | ⬜ | — | SAP OData /getItems endpoint |
| `LEADS_API_URL` | ⬜ | — | Backend leads endpoint |
| `GPT_TEMPERATURE` | ⬜ | `0.7` | GPT response creativity |
| `GPT_MAX_TOKENS` | ⬜ | `1000` | Max tokens per GPT response |
| `GPT_MAX_TOOL_LOOPS` | ⬜ | `6` | Max tool calls per turn |
| `CB_FAILURE_THRESHOLD` | ⬜ | `5` | Circuit breaker trip threshold |
| `RECOMMENDATION_SCORER` | ⬜ | `rule_based` | `rule_based` or `hybrid_ai` |

### Backend (`backend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SECRET_KEY` | ✅ | — | Django 50-char secret key |
| `DEBUG` | ✅ | `False` | Enable debug mode |
| `ALLOWED_HOSTS` | ✅ | — | Comma-separated hostnames |
| `CSRF_TRUSTED_ORIGINS` | ✅ | — | Comma-separated HTTPS origins |
| `AI_BOT_BASE_URL` | ✅ | — | URL of AI service (e.g. `http://ai:8000`) |
| `EMAIL_*` | ✅ | — | SMTP configuration for OTP emails |
| `META_VERIFY_TOKEN` | ✅ | — | Meta webhook verification token |
| `META_FB_PAGE_ACCESS_TOKEN` | ⬜ | — | Facebook page token |
| `META_IG_PAGE_ACCESS_TOKEN` | ⬜ | — | Instagram token (starts IGA...) |
| `META_WHATSAPP_PHONE_NUMBER_ID` | ⬜ | — | WhatsApp phone number ID |

---

## Database Setup & Migrations

### AI Service (PostgreSQL + Alembic)

```bash
# Run all migrations
docker compose exec ai alembic upgrade head

# Create a new migration (after model change)
docker compose exec ai alembic revision --autogenerate -m "describe_change"

# Rollback one migration
docker compose exec ai alembic downgrade -1

# Show migration history
docker compose exec ai alembic history
```

> ⚠️ **Critical**: The `knowledge_chunks` and `user_preference_profiles` tables require the `pgvector` extension. The application handles this gracefully on startup — if pgvector is missing, those tables are skipped and RAG falls back to full knowledge injection.

### Enable pgvector manually
```sql
-- Connect to your database and run:
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Backend (SQLite + Django)
```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

---

## AI System

### Model Routing
- **GPT-4o** (complex): image inputs, Arabic text, multi-tool queries, long conversations
- **GPT-4o-mini** (fast/cheap): simple text queries, availability checks, single-product lookups

### RAG Pipeline
1. Documents uploaded via `POST /knowledge/upload` (PDF/TXT, max 20 MB)
2. Split into ~400-token overlapping chunks
3. Embedded with `text-embedding-3-small` (1536 dimensions)
4. Stored in `knowledge_chunks` table (pgvector)
5. At chat time: top-5 cosine-similar chunks retrieved and injected into system prompt

### Embedding Pipeline
- Runs nightly at **03:00 Asia/Baghdad**
- Embeds new/unembedded products using `text-embedding-3-small`
- Updates `products.embedding`, `embedding_text`, `embedding_updated_at`

### AI Tools Available to GPT
| Tool | Purpose |
|---|---|
| `search_products` | Full-text + vector search across catalog |
| `get_recommendations` | Editorial + AI-scored recommendations |
| `get_best_selling` | Best-selling products by category |
| `get_new_arrivals` | Recently added products |
| `get_featured_products` | Featured/curated products |
| `get_similar_products` | pgvector similarity search |
| `get_product_details` | Single product detail lookup |
| `check_availability` | In-stock check for a product |
| `get_bundles` | Active product bundles |

### Circuit Breaker
Protects against OpenAI outages:
- **CLOSED → OPEN**: after 5 consecutive failures
- **OPEN**: fast-fail for 60 seconds, returns degraded message
- **HALF_OPEN**: probe 1 request; 2 successes → CLOSED

---

## SAP Integration

SAP is the **sole source of truth** for pricing and stock:

- **Schedule**: 06:00 and 18:00 Asia/Baghdad (Iraq timezone)
- **Endpoint**: `SAP_API_URL/getItems` (GET, returns JSON array)
- **Fields updated**: `price`, `available_qty`, `sap_product_id`, `last_synced_sap`
- **Fields NEVER overwritten**: all editorial, recommendation, and classification fields
- **Price protection**: products with `price_source_override=True` keep their manual price

### Trigger sync manually
```bash
# Via API (authenticated admin)
curl -X POST https://yourdomain.com/api/v1/bot/sap/sync/ \
     -H "Authorization: Bearer <token>"

# Via Docker exec
docker compose exec ai python -m services.sync
```

### Audit log
Every sync writes one row to `sap_sync_audit_log` (status, counts, duration, errors).
Check via `GET /ready` endpoint or query the table directly.

---

## Meta Webhooks

### Supported Platforms
| Platform | Webhook Path | Token Setting |
|---|---|---|
| Facebook Messenger | `POST /webhook/facebook/` | `META_FB_PAGE_ACCESS_TOKEN` |
| Instagram DM | `POST /webhook/instagram/` | `META_IG_PAGE_ACCESS_TOKEN` |
| WhatsApp | `POST /webhook/whatsapp/` | `META_WHATSAPP_PHONE_NUMBER_ID` |

### Webhook Verification (GET request)
All webhook endpoints support `hub.mode=subscribe` verification using `META_VERIFY_TOKEN`.

### Message Flow
```
Webhook received → parse → save ConversationMessage → 
threading.Thread → BotService.get_bot_reply() → AI service →
MetaApiService.send_message() → Meta Graph API
```

> ⚠️ **Note**: Bot replies run in a daemon thread. If the Django process restarts mid-reply, the thread is lost. Consider moving to Celery for production reliability.

---

## API Overview

### Backend REST API (`/api/v1/`)

| Endpoint | Method | Auth | Description |
|---|---|---|---|
| `/auth/login/` | POST | — | JWT login (returns access + refresh) |
| `/auth/register/` | POST | — | User registration |
| `/auth/token/refresh/` | POST | — | Refresh access token |
| `/auth/forgot-password/` | POST | — | Request OTP |
| `/auth/verify-otp/` | POST | — | Verify OTP |
| `/auth/reset-password/` | POST | — | Reset password with OTP |
| `/api/v1/bot/rate/` | GET/POST | Any/Auth | Exchange rate |
| `/api/v1/bot/prompt/` | GET/PUT | Auth | AI system prompt |
| `/api/v1/bot/knowledge/` | GET | Auth | List knowledge base |
| `/api/v1/bot/knowledge/upload/` | POST | Auth | Upload PDF/TXT |
| `/api/v1/bot/products/` | GET | Auth | List products |
| `/api/v1/bot/products/upload/` | POST | Auth | Bulk Excel import |
| `/api/v1/bot/products/export/` | GET | Auth | Export products Excel |
| `/api/v1/bot/products/<barcode>/` | GET/PUT/DELETE | Auth | Product CRUD |
| `/api/v1/bot/ai/recommend/` | POST | Auth | AI recommendations |
| `/api/v1/bot/ai/embeddings/status/` | GET | Auth | Embedding coverage |
| `/api/v1/bot/sap/sync/` | POST | Auth | Trigger SAP sync |
| `/webhook/facebook/` | GET/POST | Meta | Facebook webhook |
| `/webhook/instagram/` | GET/POST | Meta | Instagram webhook |
| `/webhook/whatsapp/` | GET/POST | Meta | WhatsApp webhook |
| `/swagger/` | GET | — | Swagger UI |
| `/redoc/` | GET | — | ReDoc UI |

### AI Service REST API (internal)

| Endpoint | Description |
|---|---|
| `POST /reply` | Main chat endpoint |
| `GET /ready` | Readiness probe (DB + last SAP sync) |
| `GET /products` | Product list with filters |
| `GET /products/<barcode>` | Product detail |
| `POST /products/upload` | Bulk Excel import |
| `GET /categories` | Category list |
| `GET /brands` | Brand list |
| `POST /knowledge/upload` | RAG document upload |
| `GET /knowledge` | Knowledge base index |
| `POST /ai/recommend` | Recommendation engine |
| `GET /ai/embeddings/status` | Embedding pipeline status |
| `POST /sap/sync-now` | Manual SAP sync trigger |
| `GET /handoff/<user_id>` | Handoff state |
| `POST /handoff/request` | Request human agent |

---

## Authentication

- **Type**: JWT (JSON Web Tokens) via `djangorestframework-simplejwt`
- **Token lifetime**: Access = 7 days, Refresh = configurable
- **Header format**: `Authorization: Bearer <access_token>`
- **Admin role**: Only `ADMIN` role exists in `accounts.User`
- **Custom user model**: Email-based (no `username` field)

### OTP Password Reset Flow
1. `POST /auth/forgot-password/` with `{"email": "..."}`
2. 6-digit OTP sent via email (expires in 5 minutes)
3. `POST /auth/verify-otp/` with `{"email": "...", "code": "..."}`
4. `POST /auth/reset-password/` with `{"email": "...", "code": "...", "new_password": "..."}`

---

## Production Deployment

### Ubuntu VPS with Docker

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 2. Clone repository
git clone <repo-url>
cd "project_47_..."

# 3. Create external volume
docker volume create ai_postgres_data

# 4. Configure environment
cp AI/.env.example AI/.env
cp backend/.env.example backend/.env
# Edit both files with production values

# 5. Create SSL certificates directory
mkdir -p nginx/certs
# Copy your fullchain.pem and privkey.pem to nginx/certs/

# 6. Set domain name
export DOMAIN_NAME=yourdomain.com
envsubst '${DOMAIN_NAME}' < nginx/nginx.prod.conf > nginx/nginx.conf

# 7. Build and start production stack
docker compose -f docker-compose.prod.yml up -d --build

# 8. Run database migrations
docker compose -f docker-compose.prod.yml exec ai alembic upgrade head

# 9. Create Django superuser
docker compose -f docker-compose.prod.yml exec backend \
  python manage.py createsuperuser

# 10. Verify health
curl https://yourdomain.com/api/v1/
```

### SSL with Let's Encrypt (Certbot)

```bash
# Install certbot
sudo apt install certbot

# Stop nginx temporarily
docker compose -f docker-compose.prod.yml stop nginx

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com

# Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/certs/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/certs/
sudo chown $USER:$USER nginx/certs/*.pem

# Restart
docker compose -f docker-compose.prod.yml start nginx

# Auto-renew (add to crontab)
0 3 * * * certbot renew --quiet && \
  cp /etc/letsencrypt/live/yourdomain.com/*.pem \
     /path/to/project/nginx/certs/ && \
  docker compose -f /path/to/project/docker-compose.prod.yml exec nginx \
     nginx -s reload
```

### Firewall Setup (UFW)

```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

---

## Background Jobs & Cron

All cron jobs run inside the AI service container, managed by **APScheduler** with `AsyncIOScheduler`:

| Job | Schedule | Description |
|---|---|---|
| `sap_sync` | 06:00 + 18:00 IQ | SAP price/stock sync |
| `embedding_pipeline` | 03:00 IQ | Embed unembedded products |
| `cache_invalidation` | 06:05 + 18:05 IQ | Flush product Redis caches |

**Safety**: Only `APP_WORKER_ID=0` starts the scheduler (prevents duplicate jobs in multi-worker Gunicorn).

---

## Security

### Current Controls
- ✅ JWT authentication on all admin endpoints
- ✅ CORS restricted to known origins
- ✅ CSRF protection (Django middleware)
- ✅ SSL termination via nginx
- ✅ WhiteNoise for static file serving (no directory traversal)
- ✅ Rate limiting in nginx per IP
- ✅ No hardcoded secrets (all via env vars / decouple)
- ✅ `SECURE_PROXY_SSL_HEADER` configured for proxy-terminated HTTPS
- ✅ pgvector tables use parameterized queries (no SQL injection)
- ✅ File upload validation (extension, MIME type, size)

### Issues to Address
- ⚠️ `CORS_ALLOW_ALL_ORIGINS = True` in `settings.py` — should be `False` in production
- ⚠️ `debug_toolbar` installed in production requirements (performance risk)
- ⚠️ `httpx.AsyncClient(verify=False)` in SAP sync (SSL verification disabled)
- ⚠️ Bot replies run in `threading.Thread` — unreliable under load
- ⚠️ SQLite for conversations (not suitable if scaling beyond 1 instance)
- ⚠️ No webhook signature verification for Meta events

---

## Performance

### Caching Strategy (Redis)
| Cache Key Pattern | TTL | Invalidated By |
|---|---|---|
| `dhifaf:products:best_sellers:*` | 30 min | SAP sync |
| `dhifaf:products:new_arrivals:*` | 30 min | SAP sync |
| `dhifaf:products:featured:*` | 30 min | SAP sync |
| `dhifaf:products:recommended:*` | 30 min | SAP sync |
| `dhifaf:products:detail:<barcode>` | 60 min | Product CRUD |
| `dhifaf:availability:<hash>` | 15 min | — |
| `dhifaf:handoff:state:<user_id>` | 10 min | Handoff transitions |

### Database Indexes (Key)
- GIN full-text index on `productsearchindex.search_text`
- GIN trigram index on `productsearchindex.search_text` (ILIKE queries)
- pgvector IVFFLAT index on `products.embedding` (cosine similarity)
- Composite partial indexes on `products` for all recommendation patterns

---

## Monitoring & Logging

### Structured Logging
The AI service uses structured key=value logging via `core/logging_config.py`:
```
INFO http_request method=POST path=/reply status=200 duration_ms=1243
INFO orchestrator_done user=123 model=gpt-4o-mini loops=2 tokens_in=1847 tokens_out=312 rag_chunks=3 elapsed_ms=1241
INFO sap_sync_completed updated=1420 not_found=32 skipped=0 price_protected=5 duration=18.32
```

### Health Endpoints
```bash
# AI service readiness (DB + last SAP sync status)
curl http://localhost:8000/ready

# Docker health checks
docker compose ps
```

### View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f ai
docker compose logs -f backend

# Since time
docker compose logs --since 1h ai
```

---

## Backup & Restore

### Backup PostgreSQL
```bash
docker compose exec postgres pg_dump \
  -U postgres simple_test_db \
  > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore PostgreSQL
```bash
docker compose exec -T postgres psql \
  -U postgres simple_test_db \
  < backup_20260101_120000.sql
```

### Backup SQLite (backend conversations)
```bash
docker compose cp backend:/app/data/db.sqlite3 ./backup_sqlite.db
```

### Backup Redis
```bash
docker compose exec redis redis-cli -a admin123 BGSAVE
docker compose cp redis:/data/dump.rdb ./backup_redis.rdb
```

### Backup Knowledge Base Files
```bash
# Knowledge base files are in a local mount
cp -r AI/knowledge_base ./backup_knowledge_base/
```

---

## Troubleshooting

### AI service fails to start (pgvector missing)
The service handles this gracefully. Check the log:
```
WARNING pgvector_table_skipped table=knowledge_chunks reason=pgvector_not_installed
```
Fix: Ensure you're using `pgvector/pgvector:pg17` image and the extension is enabled.

### SAP sync shows "SAP_API_URL not configured"
Set `SAP_API_URL` in `AI/.env`. Verify with:
```bash
docker compose exec ai env | grep SAP_API_URL
```

### "AI_BOT_BASE_URL not configured" in backend logs
Set `AI_BOT_BASE_URL=http://ai:8000` in `backend/.env`.

### Redis not connecting
```bash
docker compose exec redis redis-cli -a admin123 ping
# Should return: PONG
```

### JWT token expired
The default access token lifetime is 7 days. Request a new one via `POST /auth/token/refresh/`.

### Circuit breaker is OPEN
Wait 60 seconds for auto-recovery, or check OpenAI API status.
View state via `GET /ready` response body.

---

## Improvement Roadmap

### Critical
1. **Set `CORS_ALLOW_ALL_ORIGINS = False`** — restrict to production domain
2. **Remove `django-debug-toolbar` from production** dependencies
3. **Enable SSL verification** in SAP sync (`verify=True` in httpx)
4. **Add Meta webhook signature verification** (X-Hub-Signature-256)
5. **Replace threading.Thread** with Celery for bot replies (reliability)

### High Priority
6. **PostgreSQL for backend** — SQLite is a single-writer bottleneck
7. **Rate limiting on API endpoints** — currently only at nginx level
8. **Celery + Redis for background tasks** — replace APScheduler threading
9. **Centralised secrets management** — HashiCorp Vault or AWS Secrets Manager
10. **Token versioning / revocation** — current JWT has no revocation mechanism

### Medium Priority
11. **Prometheus metrics** — expose `/metrics` from AI service
12. **Grafana dashboard** — visualize SAP sync health, token usage, response times
13. **Sentry error tracking** — capture exceptions with context
14. **Automated tests** — currently minimal coverage
15. **CI/CD pipeline** — GitHub Actions: lint → test → build → deploy
16. **CDN for media files** — move to S3/CloudFront for scale

### Low Priority
17. **WebSocket support** — real-time dashboard updates
18. **Multi-language admin** — Arabic UI for dashboard
19. **A/B testing framework** — test recommendation algorithms
20. **Product image analysis** — use GPT-4o vision to auto-tag products

---

## Known Issues

1. `debug_toolbar` is in `requirements.txt` — harmless in dev but adds overhead in production. Remove from prod image.
2. `CORS_ALLOW_ALL_ORIGINS = True` bypasses CORS protection. **Must be fixed before going live.**
3. `httpx.AsyncClient(verify=False)` skips TLS verification for SAP. Only acceptable for internal SAP APIs with self-signed certs.
4. Bot replies use daemon threads — a crash during bot reply will silently drop the response.
5. The frontend `db.sqlite3` file is present in the frontend directory (leftover artifact, safe to delete).

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the existing code style:
   - Python: structured logging, type hints, docstrings on all public methods
   - Django: DRF serializers for all input validation
   - React: TanStack Query for server state, no raw `fetch`
4. Test your changes locally with `docker-compose.dev.yml`
5. Submit a pull request with a clear description

---

## License

See [LICENSE](backend/LICENSE) file.

---

*Generated by Antigravity — Production Readiness Audit*
