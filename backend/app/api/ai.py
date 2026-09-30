from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user_payload
from app.schemas.ai import (
    AITutorRequest,
    AITutorResponse,
    AIQuizGenerateRequest,
    AIExplainRequest,
    AIStudyPlanRequest,
    AIGenericResponse,
)
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI"])

# One shared service instance per application lifecycle
_ai_service = AIService()


@router.post("/tutor", response_model=AITutorResponse)
async def ask_tutor(
    request: AITutorRequest,
    payload: dict = Depends(get_current_user_payload),
):
    """Ask the AI tutor a question (authenticated users only)."""
    try:
        return await _ai_service.ask_tutor(request)
    except RuntimeError as e:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=str(e))


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
