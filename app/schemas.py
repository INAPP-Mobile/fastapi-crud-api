from datetime import datetime
from pydantic import BaseModel, Field


class ItemCreate(BaseModel):
    title: str = Field(min_length=1)
    description: str | None = None
    completed: bool = False


class ItemUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None


class ItemRead(BaseModel):
    id: int
    title: str
    description: str | None
    completed: bool
    created_at: datetime
    updated_at: datetime
    model_config = {"from_attributes": True}
