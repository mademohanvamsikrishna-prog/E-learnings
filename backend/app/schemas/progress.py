import uuid
from pydantic import BaseModel


class ProgressUpdate(BaseModel):
    lesson_id: uuid.UUID
    enrollment_id: uuid.UUID
    is_completed: bool = False
    watch_duration_seconds: int = 0


class ProgressResponse(BaseModel):
    id: uuid.UUID
    lesson_id: uuid.UUID
    enrollment_id: uuid.UUID
    is_completed: bool
    watch_duration_seconds: int

    model_config = {"from_attributes": True}
