# CRUD API Builder

A production-ready **FastAPI + SQLModel CRUD API** with PostgreSQL storage, 6 REST endpoints, automatic OpenAPI docs, health checks, and CORS support. Deploy on Railway in one click — no Dockerfile needed.

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/deploy/content-playfulness)

## Features

- **6 REST endpoints** — Full CRUD with proper HTTP status codes
- **PostgreSQL** — Auto-provisioned database via Railway
- **Auto-migrations** — Tables created on startup via SQLModel
- **OpenAPI docs** — Interactive Swagger UI at `/docs`
- **Health checks** — `/health` endpoint with DB connectivity check
- **CORS enabled** — Ready for cross-origin requests
- **12 tests** — pytest suite for all endpoints
- **Railpack auto-detect** — No Dockerfile needed

## API Reference

| Method | Endpoint | Description | Status Codes |
|--------|----------|-------------|-------------|
| `GET` | `/` | API info and version | 200 |
| `GET` | `/health` | Health check + DB connectivity | 200 |
| `POST` | `/items/` | Create a new item | **201** |
| `GET` | `/items/` | List items (`?skip=0&limit=100`) | 200 |
| `GET` | `/items/{id}` | Get item by ID | 200 / **404** |
| `PUT` | `/items/{id}` | Update item fields | 200 / **404** |
| `DELETE` | `/items/{id}` | Delete item | **204** / **404** |

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run with SQLite (development)
uvicorn app.main:app --reload

# Run tests
pytest tests/ -v
```

## Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/deploy/content-playfulness)

Click the button above, or go to https://railway.com/deploy/content-playfulness — Railway auto-provisions both the app and PostgreSQL.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `sqlite:///./test.db` |

Set automatically by Railway when PostgreSQL is provisioned.

## Template

Published on the Railway marketplace: https://railway.com/deploy/content-playfulness

Kickback monetization: 25% revenue share from every deployment.
