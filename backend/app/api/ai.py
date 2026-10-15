"""
AI API Router — /api/v1/ai/*
──────────────────────────────────────────────────────────────────────────────
Endpoints:
  POST /ai/chat          — AI Tutor chat (authenticated or dev guest)
  POST /ai/tutor         — Simple Q&A with optional DB context lookup
  POST /ai/generate-quiz — AI quiz generator (authenticated, any role)
  POST /ai/explain       — Lesson explainer (authenticated; fetches DB content)
  POST /ai/study-plan    — Personalised study planner (authenticated students)

Security:
  - /chat uses get_ai_user_payload (allows dev guest; production requires JWT)
  - All other endpoints use get_current_user_payload (strict JWT required)
  - Lesson content is fetched from DB and access-checked (enrolled or instructor)
  - Course/lesson IDs are validated as proper UUIDs before DB lookup
  - AI output is validated by Pydantic schemas before being returned
  - Errors are generic — no internal stack traces or provider details returned
"""

import logging
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user_payload, get_ai_user_payload, get_db
from app.models.course import Course
from app.models.lesson import Lesson
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.progress import Progress
from app.models.quiz import Quiz, QuizAttempt
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    AITutorRequest,
    AITutorResponse,
    AIQuizGenerateRequest,
    AIQuizGenerateResponse,
    AIExplainRequest,
    AIExplainResponse,
    AIStudyPlanRequest,
    AIStudyPlanResponse,
)
from app.services.openai_service import (
    OpenAIService,
    OpenAIRateLimitError,
    OpenAIConfigError,
    OpenAIAuthError,
    OpenAIServiceUnavailableError,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI"])

# One shared service instance per application lifecycle
_ai_service = OpenAIService()


# ─── Helpers ─────────────────────────────────────────────────────────────────────

def _safe_uuid(value: Optional[str]) -> Optional[uuid.UUID]:
    """Parse a UUID string safely, returning None on invalid input."""
    if not value:
        return None
    try:
        return uuid.UUID(str(value))
    except (ValueError, AttributeError):
        return None


def _ai_error_response(exc: Exception, default_message: str = "AI service temporarily unavailable."):
    """Convert a known AI service exception into a safe HTTP response."""
    if isinstance(exc, OpenAIRateLimitError):
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={"success": False, "message": exc.message},
        )
    if isinstance(exc, (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError)):
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"success": False, "message": exc.message},
        )
    logger.error(f"[AI] Unexpected error: {type(exc).__name__}")
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"success": False, "message": default_message},
    )


async def _resolve_course_title(db: AsyncSession, course_id: Optional[str]) -> Optional[str]:
    """Look up a course title from a UUID string. Returns None on invalid ID or not found."""
    uid = _safe_uuid(course_id)
    if not uid:
        return None
    result = await db.execute(select(Course.title).where(Course.id == uid))
    return result.scalar_one_or_none()


async def _resolve_lesson(db: AsyncSession, lesson_id: Optional[str]) -> Optional[Lesson]:
    """Look up a lesson from a UUID string. Returns None on invalid ID or not found."""
    uid = _safe_uuid(lesson_id)
    if not uid:
        return None
    result = await db.execute(select(Lesson).where(Lesson.id == uid))
    return result.scalar_one_or_none()


async def _is_enrolled(db: AsyncSession, student_id: uuid.UUID, course_id: uuid.UUID) -> bool:
    """
    BUG-12 fix: include COMPLETED enrollments so students who finished a course
    still have access to AI explanations and study plans for that course.
    """
    result = await db.execute(
        select(Enrollment.id).where(
            Enrollment.student_id == student_id,
            Enrollment.course_id == course_id,
            Enrollment.status.in_([EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED]),
        )
    )
    return result.scalar_one_or_none() is not None


# ─── POST /ai/chat ────────────────────────────────────────────────────────────────

@router.post("/chat", response_model=AIChatResponse)
async def chat(
    request: AIChatRequest,
    payload: dict = Depends(get_ai_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    AI Tutor chat. Accepts question with optional course/lesson context.
    If course_id is provided, resolves the course title from the database so the
    AI receives a meaningful title rather than a UUID string.
    """
    query = request.get_query()

    if not query:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Question cannot be empty"},
        )

    student_id = payload.get("sub", "anonymous")
    logger.info(f"[AI Chat] Request from student='{student_id}' query_len={len(query)}")

    # Resolve course title from DB when a course_id is present
    course_title = request.course_title
    if request.course_id and not course_title:
        course_title = await _resolve_course_title(db, request.course_id)

    # Resolve lesson title similarly
    lesson_title = request.lesson_title
    if request.lesson_id and not lesson_title:
        lesson = await _resolve_lesson(db, request.lesson_id)
        if lesson:
            lesson_title = lesson.title

    try:
        # BUG-21 fix: use the already-imported AIChatRequest directly
        enriched = AIChatRequest(
            message=request.message,
            question=request.question,
            history=request.history,
            course_id=request.course_id,
            course_title=course_title,
            lesson_id=request.lesson_id,
            lesson_title=lesson_title,
            topic=request.topic,
        )
        response = await _ai_service.chat(enriched)
        return response

    except Exception as exc:
        return _ai_error_response(exc, "The AI Tutor is temporarily unavailable. Please try again.")


# ─── POST /ai/tutor ───────────────────────────────────────────────────────────────

@router.post("/tutor", response_model=AITutorResponse)
async def ask_tutor(
    request: AITutorRequest,
    payload: dict = Depends(get_ai_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    Simple Q&A endpoint. Resolves course/lesson titles from the DB before
    passing context to the AI — never passes raw UUIDs as context strings.
    """
    if not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty",
        )

    # Resolve titles from DB
    course_title = await _resolve_course_title(db, request.course_id)
    lesson_title = None
    lesson = await _resolve_lesson(db, request.lesson_id)
    if lesson:
        lesson_title = lesson.title

    try:
        return await _ai_service.ask_tutor(
            request, course_title=course_title, lesson_title=lesson_title
        )
    except Exception as exc:
        if isinstance(exc, (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError)):
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.message)
        if isinstance(exc, OpenAIRateLimitError):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=exc.message)
        logger.error(f"[AI Tutor] Unexpected error: {type(exc).__name__}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI Tutor is temporarily unavailable. Please try again.",
        )


# ─── POST /ai/generate-quiz ───────────────────────────────────────────────────────

@router.post("/generate-quiz", response_model=AIQuizGenerateResponse)
async def generate_quiz(
    request: AIQuizGenerateRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate AI quiz questions on a topic.
    Returns structured, validated questions — not a raw string.
    Answer keys are included; the frontend must gate them from students
    until submission (the API itself is role-agnostic at this layer).
    """
    # Resolve course context for better quiz generation
    course_title = await _resolve_course_title(db, request.course_id)
    if course_title:
        # Append course context to topic for better relevance
        enriched_topic = f"{request.topic} (from course: {course_title})"
        from app.schemas.ai import AIQuizGenerateRequest as _Req
        request = _Req(
            topic=enriched_topic,
            num_questions=request.num_questions,
            difficulty=request.difficulty,
            question_type=request.question_type,
            course_id=request.course_id,
        )

    try:
        return await _ai_service.generate_quiz(request)
    except Exception as exc:
        if isinstance(exc, (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError)):
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.message)
        if isinstance(exc, OpenAIRateLimitError):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=exc.message)
        logger.error(f"[AI Quiz] Unexpected error: {type(exc).__name__}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Quiz generation temporarily unavailable. Please try again.")


# ─── POST /ai/explain ─────────────────────────────────────────────────────────────

@router.post("/explain", response_model=AIExplainResponse)
async def explain_content(
    request: AIExplainRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    Explain lesson content at a requested difficulty level.

    When a lesson_id is provided:
    - The lesson is looked up in the database.
    - Access is verified: user must be enrolled in the course OR be the instructor.
    - The DB lesson content is used instead of the client-supplied content.

    When no lesson_id is provided, the client-supplied content is used (validated by schema).
    """
    student_id_str = payload.get("sub", "")
    student_uuid = _safe_uuid(student_id_str)
    used_db_content = False
    lesson_title: Optional[str] = None

    if request.lesson_id:
        lesson = await _resolve_lesson(db, request.lesson_id)
        if not lesson:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Lesson not found.",
            )

        # Get the course_id via the module relationship for enrollment check
        from sqlalchemy.orm import joinedload
        result = await db.execute(
            select(Lesson).options(joinedload(Lesson.module)).where(
                Lesson.id == _safe_uuid(request.lesson_id)
            )
        )
        lesson_with_module = result.unique().scalar_one_or_none()

        if lesson_with_module and student_uuid:
            course_id = lesson_with_module.module.course_id if lesson_with_module.module else None
            if course_id:
                enrolled = await _is_enrolled(db, student_uuid, course_id)
                if not enrolled:
                    # Check if free preview lesson (publicly accessible)
                    if not lesson.is_free_preview:
                        raise HTTPException(
                            status_code=status.HTTP_403_FORBIDDEN,
                            detail="You must be enrolled in this course to access lesson explanations.",
                        )

        # Use DB content if available; fall back to client-supplied
        if lesson.text_content and lesson.text_content.strip():
            from app.schemas.ai import AIExplainRequest as _Req
            request = _Req(
                content=lesson.text_content[:12000],
                target_level=request.target_level,
                lesson_id=request.lesson_id,
            )
            used_db_content = True

        lesson_title = lesson.title

    try:
        return await _ai_service.explain_content(
            request, lesson_title=lesson_title, used_db_content=used_db_content
        )
    except Exception as exc:
        if isinstance(exc, (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError)):
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.message)
        if isinstance(exc, OpenAIRateLimitError):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=exc.message)
        logger.error(f"[AI Explain] Unexpected error: {type(exc).__name__}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Explanation service temporarily unavailable. Please try again.")


# ─── POST /ai/study-plan ──────────────────────────────────────────────────────────

@router.post("/study-plan", response_model=AIStudyPlanResponse)
async def create_study_plan(
    request: AIStudyPlanRequest,
    payload: dict = Depends(get_current_user_payload),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a personalised study plan for the authenticated student.

    Fetches actual enrollment and progress data from the database so the
    AI generates a realistic plan based on what the student has actually completed.
    Prevents students from accessing another student's data by using only the
    JWT sub claim to identify the student.
    """
    student_id_str = payload.get("sub", "")
    student_uuid = _safe_uuid(student_id_str)
    course_uuid = _safe_uuid(request.course_id)

    if not student_uuid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject.")

    # ── 1. Verify the student is enrolled in the requested course ────────────────
    if course_uuid:
        enrolled = await _is_enrolled(db, student_uuid, course_uuid)
        if not enrolled:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must be enrolled in this course to generate a study plan.",
            )

    # ── 2. Resolve course title ──────────────────────────────────────────────────
    course_title = await _resolve_course_title(db, request.course_id)

    # ── 3. Fetch lesson list (via modules) for context ───────────────────────────
    enrolled_lessons: Optional[list] = None
    completed_lessons: Optional[list] = None
    quiz_scores: Optional[dict] = None

    if course_uuid:
        # Get all lesson titles in the course
        from app.models.course import Module
        lesson_result = await db.execute(
            select(Lesson.id, Lesson.title)
            .join(Lesson.module)
            .where(Module.course_id == course_uuid)
            .order_by(Module.order, Lesson.order)
        )
        all_lessons = lesson_result.all()
        enrolled_lessons = [row.title for row in all_lessons]

        # Get completed lessons for this student
        if all_lessons:
            lesson_ids = [row.id for row in all_lessons]
            progress_result = await db.execute(
                select(Progress.lesson_id).where(
                    Progress.student_id == student_uuid,
                    Progress.lesson_id.in_(lesson_ids),
                    Progress.is_completed == True,
                )
            )
            completed_ids = {row.lesson_id for row in progress_result.all()}
            completed_lessons = [
                row.title for row in all_lessons if row.id in completed_ids
            ]

        # BUG-10 fix: filter quiz scores to this course only by joining to Quiz
        quiz_result = await db.execute(
            select(QuizAttempt.quiz_id, QuizAttempt.score)
            .join(Quiz, QuizAttempt.quiz_id == Quiz.id)
            .where(
                QuizAttempt.student_id == student_uuid,
                Quiz.course_id == course_uuid,
                QuizAttempt.score.isnot(None),
            )
        )
        scores = quiz_result.all()
        if scores:
            quiz_scores = {str(row.quiz_id): row.score for row in scores}

    try:
        return await _ai_service.create_study_plan(
            request,
            course_title=course_title,
            enrolled_lessons=enrolled_lessons,
            completed_lessons=completed_lessons,
            quiz_scores=quiz_scores,
        )
    except Exception as exc:
        if isinstance(exc, (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError)):
            raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=exc.message)
        if isinstance(exc, OpenAIRateLimitError):
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=exc.message)
        logger.error(f"[AI Study Plan] Unexpected error: {type(exc).__name__}")
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                            detail="Study plan generation temporarily unavailable. Please try again.")
