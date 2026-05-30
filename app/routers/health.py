from fastapi import APIRouter, Depends
from sqlmodel import Session, text
from app.database import get_session

router = APIRouter()


@router.get("/health")
def health_check(session: Session = Depends(get_session)):
    try:
        session.exec(text("SELECT 1"))
        return {"status": "ok", "database": "connected"}
    except Exception:
        return {"status": "error", "database": "disconnected"}
