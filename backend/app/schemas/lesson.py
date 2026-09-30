import uuid
from typing import Optional
from pydantic import BaseModel


class LessonCreate(BaseModel):
    title: str
    description: Optional[str] = None
    content_type: str = "VIDEO"
    content_url: Optional[str] = None
    text_content: Optional[str] = None
    duration_seconds: Optional[int] = None
    order: int = 0
    is_free_preview: bool = False
    module_id: uuid.UUID


class LessonUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    content_url: Optional[str] = None
    text_content: Optional[str] = None
    duration_seconds: Optional[int] = None
    order: Optional[int] = None
    is_free_preview: Optional[bool] = None


class LessonResponse(BaseModel):
    id: uuid.UUID
    title: str
    content_type: str
    content_url: Optional[str] = None
    duration_seconds: Optional[int] = None
    order: int
    is_free_preview: bool
    module_id: uuid.UUID

    model_config = {"from_attributes": True}
