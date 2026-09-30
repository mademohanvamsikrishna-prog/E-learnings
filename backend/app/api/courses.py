from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from app.core.dependencies import get_db, get_current_user_payload, require_instructor
from app.schemas.course import CourseCreate, CourseUpdate, CourseResponse
from app.services.course_service import CourseService

router = APIRouter(prefix="/courses", tags=["Courses"])


@router.get("/", response_model=List[CourseResponse])
async def list_courses(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
):
    """List all published courses (public endpoint)."""
    return await CourseService.list_published_courses(db, skip=skip, limit=limit)


@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(course_id: uuid.UUID, db: AsyncSession = Depends(get_db)):
    """Get a single course by ID."""
    course = await CourseService.get_course(db, course_id)
    if not course:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found.")
    return course


@router.post("/", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    data: CourseCreate,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(require_instructor),
):
    """Create a new course (Instructor / Admin only)."""
    instructor_id = uuid.UUID(payload["sub"])
    return await CourseService.create_course(db, data, instructor_id)


@router.patch("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: uuid.UUID,
    data: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(require_instructor),
):
    """Update a course (owner instructor or admin only)."""
    instructor_id = uuid.UUID(payload["sub"])
    course = await CourseService.update_course(db, course_id, data, instructor_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or you do not have permission to edit it.",
        )
    return course


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    payload: dict = Depends(require_instructor),
):
    """Delete a course (owner instructor or admin only)."""
    instructor_id = uuid.UUID(payload["sub"])
    deleted = await CourseService.delete_course(db, course_id, instructor_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found or permission denied.",
        )
