import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse

from app.core.dependencies import get_current_user_payload, get_ai_user_payload
from app.schemas.ai import (
    AIChatRequest,
    AIChatResponse,
    AITutorRequest,
    AITutorResponse,
    AIQuizGenerateRequest,
    AIExplainRequest,
    AIStudyPlanRequest,
    AIGenericResponse,
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


@router.post("/chat", response_model=AIChatResponse)
async def chat(
    request: AIChatRequest,
    payload: dict = Depends(get_ai_user_payload),
):
    """
    Primary endpoint for AI Tutor chat.
    Validates input, maintains conversational context, respects course context,
    and returns a structured response with markdown formatting.
    """
    query = request.get_query()

    # ── Request Validation ──────────────────────────────────────────────────────────
    if not query:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"success": False, "message": "Question cannot be empty"},
        )

    # Maximum length protection against abuse
    if len(query) > 4000:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={
                "success": False,
                "message": "Question is too long (maximum 4000 characters).",
            },
        )

    # Student context from authenticated token or dev session
    student_id = payload.get("sub", "anonymous")
    logger.info(f"[AI Chat] Processing question from student '{student_id}' (len={len(query)})")

    # ── Service Execution & Safe Error Handling ───────────────────────────────────
    try:
        response = await _ai_service.chat(request)
        return response

    except OpenAIRateLimitError:
        return JSONResponse(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            content={
                "success": False,
                "message": "The AI Tutor is currently busy. Please try again in a moment.",
            },
        )
    except (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError) as e:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={
                "success": False,
                "message": e.message or "The AI Tutor is temporarily unavailable. Please try again.",
            },
        )
    except Exception as exc:
        logger.error(f"[AI Chat] Unexpected error: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "success": False,
                "message": "The AI Tutor is temporarily unavailable. Please try again.",
            },
        )


@router.post("/tutor", response_model=AITutorResponse)
async def ask_tutor(
    request: AITutorRequest,
    payload: dict = Depends(get_ai_user_payload),
):
    """Ask the AI tutor a question (authenticated users or active student session)."""
    if not request.question or not request.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question cannot be empty",
        )
    try:
        return await _ai_service.ask_tutor(request)
    except (OpenAIConfigError, OpenAIAuthError, OpenAIServiceUnavailableError) as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=e.message)
    except OpenAIRateLimitError as e:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail=e.message)
    except Exception as e:
        logger.error(f"[AI Tutor] Error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="The AI Tutor is temporarily unavailable. Please try again.",
        )


@router.post("/generate-quiz", response_model=AIGenericResponse)
async def generate_quiz(
    request: AIQuizGenerateRequest,
    payload: dict = Depends(get_current_user_payload),
):
    """Generate quiz questions using AI (authenticated users only)."""
    try:
        return await _ai_service.generate_quiz(request)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))


@router.post("/explain", response_model=AIGenericResponse)
async def explain_content(
    request: AIExplainRequest,
    payload: dict = Depends(get_current_user_payload),
):
    """Request an AI explanation of course content."""
    try:
        return await _ai_service.explain_content(request)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))


@router.post("/study-plan", response_model=AIGenericResponse)
async def create_study_plan(
    request: AIStudyPlanRequest,
    payload: dict = Depends(get_current_user_payload),
):
    """Generate a personalised study plan for the authenticated student."""
    try:
        return await _ai_service.create_study_plan(request)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))
