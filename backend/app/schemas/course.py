import uuid
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel, Field


class CourseCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=255)
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Decimal = Field(default=Decimal("0.00"), ge=0)
    level: str = "BEGINNER"
    is_free: bool = False
    language: str = "en"
    category_id: Optional[uuid.UUID] = None


class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    short_description: Optional[str] = None
    price: Optional[Decimal] = None
    level: Optional[str] = None
    status: Optional[str] = None
    thumbnail_url: Optional[str] = None
    is_free: Optional[bool] = None


class CourseResponse(BaseModel):
    id: uuid.UUID
    title: str
    slug: str
    description: Optional[str] = None
    short_description: Optional[str] = None
    thumbnail_url: Optional[str] = None
    price: Decimal
    level: str
    status: str
    is_free: bool
    language: str
    instructor_id: uuid.UUID

    model_config = {"from_attributes": True}
