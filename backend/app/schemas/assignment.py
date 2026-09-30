import uuid
from typing import Optional
from pydantic import BaseModel


class AssignmentCreate(BaseModel):
    title: str
    description: str
    due_date: Optional[str] = None
    max_score: str = "100"
    course_id: uuid.UUID


class AssignmentResponse(BaseModel):
    id: uuid.UUID
    title: str
    description: str
    due_date: Optional[str] = None
    max_score: str
    course_id: uuid.UUID

    model_config = {"from_attributes": True}


class SubmissionCreate(BaseModel):
    assignment_id: uuid.UUID
    content: Optional[str] = None
    file_url: Optional[str] = None
