import logging
from typing import Optional

from app.core.config import get_settings
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
from app.services.openai_service import OpenAIService

settings = get_settings()
logger = logging.getLogger(__name__)


class AIService:
    """
    Abstraction layer for all AI provider calls.
    Defaults to OpenAI and uses dedicated OpenAIService for chat tutoring.
    Never expose API keys — they live in settings (from .env).
    """

    def __init__(self):
        self.provider = settings.ai_provider or "openai"
        self.openai_service = OpenAIService()

    async def chat(self, request: AIChatRequest) -> AIChatResponse:
        """Answer a student's chat query with conversation context and educational rules."""
        query = request.get_query()
        if self.provider == "openai":
            res = await self.openai_service.generate_tutor_response(
                user_message=query,
                history=request.history,
                course_title=request.course_title,
                lesson_title=request.lesson_title,
                topic=request.topic,
            )
            return AIChatResponse(
                success=True,
                answer=res["answer"],
                model_used=res["model"],
            )

        # Gemini fallback
        prompt = (
            f"You are an AI Tutor in an e-learning platform. "
            f"Answer the student's question clearly and educationally:\n\n{query}"
        )
        answer = await self._generate(prompt)
        return AIChatResponse(success=True, answer=answer, model_used=self.provider)

    async def ask_tutor(self, request: AITutorRequest) -> AITutorResponse:
        """Answer a student's question using the AI tutor."""
        if self.provider == "openai":
            res = await self.openai_service.generate_tutor_response(
                user_message=request.question,
                course_title=request.course_id,
                lesson_title=request.lesson_id,
            )
            return AITutorResponse(answer=res["answer"], model_used=res["model"])

        prompt = (
            f"You are a helpful e-learning tutor. "
            f"Answer the following question clearly and concisely:\n\n{request.question}"
        )
        answer = await self._generate(prompt)
        return AITutorResponse(answer=answer, model_used=self.provider)

    async def generate_quiz(self, request: AIQuizGenerateRequest) -> AIGenericResponse:
        """Generate quiz questions on a given topic."""
        prompt = (
            f"Generate {request.num_questions} {request.question_type} questions "
            f"on the topic: '{request.topic}'. "
            f"Difficulty: {request.difficulty}. "
            f"Return as a JSON array with fields: text, options, correct_answer, explanation."
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def explain_content(self, request: AIExplainRequest) -> AIGenericResponse:
        """Explain lesson content at the requested comprehension level."""
        prompt = (
            f"Explain the following content at a {request.target_level} level. "
            f"Be concise and use simple language where needed:\n\n{request.content}"
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def create_study_plan(self, request: AIStudyPlanRequest) -> AIGenericResponse:
        """Build a personalised study plan for a student."""
        prompt = (
            f"Create a structured study plan for a student who has "
            f"{request.available_hours_per_week} hours per week available. "
            f"Course ID: {request.course_id}. "
            f"{'Target completion: ' + str(request.target_completion_weeks) + ' weeks.' if request.target_completion_weeks else ''}"
        )
        result = await self._generate(prompt)
        return AIGenericResponse(result=result, model_used=self.provider)

    async def _generate(self, prompt: str) -> str:
        """Internal dispatcher — calls the configured AI provider."""
        try:
            if self.provider == "gemini":
                import google.generativeai as genai
                genai.configure(api_key=settings.gemini_api_key)
                model = genai.GenerativeModel("gemini-1.5-flash")
                response = model.generate_content(prompt)
                return response.text

            elif self.provider == "openai":
                from openai import AsyncOpenAI
                client = AsyncOpenAI(api_key=settings.openai_api_key)
                response = await client.chat.completions.create(
                    model=settings.openai_model or "gpt-4o-mini",
                    messages=[{"role": "user", "content": prompt}],
                )
                return response.choices[0].message.content or ""

        except Exception as exc:
            logger.error(f"AI generation failed: {exc}")
            raise RuntimeError(f"AI service unavailable: {exc}") from exc

        raise ValueError(f"Unsupported AI provider: {self.provider}")
