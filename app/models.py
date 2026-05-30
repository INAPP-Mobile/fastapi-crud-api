from datetime import datetime, timezone
from sqlmodel import Field, SQLModel


def utcnow():
    return datetime.now(timezone.utc)


class Item(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(min_length=1, max_length=200, index=True)
    description: str | None = None
    completed: bool = False
    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow, sa_column_kwargs={"onupdate": utcnow})
