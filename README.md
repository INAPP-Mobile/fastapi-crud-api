# FastAPI CRUD API

A production-grade FastAPI + SQLModel CRUD API template deployable on Railway.

## Quick Start

```bash
pip install -r requirements.txt
```

## Running

```bash
uvicorn app.main:app --reload
```

## Testing

```bash
python -m pytest tests/ -v
```

## Environment Variables

| Variable       | Description                         | Default              |
|---------------|-------------------------------------|----------------------|
| `DATABASE_URL` | PostgreSQL connection string        | `sqlite:///./test.db`|

## API Documentation

- Swagger UI: `/docs`
- ReDoc: `/redoc`

## Deploy on Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)
