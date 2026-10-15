"""
User API routers.
/users/me is fully implemented; other sub-resources remain stubs
and will be implemented feature-by-feature.
"""
import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_db, get_current_user_payload
from app.models.user import User
from app.schemas.user import UserResponse

# ─── Users ───────────────────────────────────────────────────────────────────────
router_users = APIRouter(prefix="/users", tags=["Users"])


@router_users.get("/me", response_model=UserResponse)
async def get_me(
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """Return the profile of the currently authenticated user."""
    user_id_str: str = payload.get("sub", "")
    try:
        user_uuid = uuid.UUID(user_id_str)
    except (ValueError, AttributeError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token subject",
        )

    result = await db.execute(select(User).where(User.id == user_uuid))
    user: User | None = result.scalar_one_or_none()

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


# ─── Lessons ─────────────────────────────────────────────────────────────────────
router_lessons = APIRouter(prefix="/lessons", tags=["Lessons"])

@router_lessons.get("/{lesson_id}")
async def get_lesson(lesson_id: str):
    return {"message": f"Get lesson {lesson_id} — implementation pending"}


# ─── Quizzes ─────────────────────────────────────────────────────────────────────
router_quizzes = APIRouter(prefix="/quizzes", tags=["Quizzes"])

@router_quizzes.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    return {"message": f"Get quiz {quiz_id} — implementation pending"}


# ─── Assignments ─────────────────────────────────────────────────────────────────
router_assignments = APIRouter(prefix="/assignments", tags=["Assignments"])

@router_assignments.get("/{assignment_id}")
async def get_assignment(assignment_id: str):
    return {"message": f"Get assignment {assignment_id} — implementation pending"}


# ─── Progress ────────────────────────────────────────────────────────────────────
router_progress = APIRouter(prefix="/progress", tags=["Progress"])

@router_progress.get("/")
async def get_progress():
    return {"message": "Progress tracking — implementation pending"}


# ─── Enrollments ─────────────────────────────────────────────────────────────────
router_enrollments = APIRouter(prefix="/enrollments", tags=["Enrollments"])

@router_enrollments.get("/")
async def get_enrollments():
    return {"message": "Enrollments — implementation pending"}


# ─── Certificates ────────────────────────────────────────────────────────────────
router_certificates = APIRouter(prefix="/certificates", tags=["Certificates"])

@router_certificates.get("/")
async def get_certificates():
    return {"message": "Certificates — implementation pending"}
