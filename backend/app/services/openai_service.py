"""
OpenAI AI Tutor Service
───────────────────────
Handles all interactions with the OpenAI API for the AI Tutor feature.
Uses the OpenAI Responses API (with resilient fallback to Chat Completions).
API keys and secrets are strictly managed via backend configuration and are
never exposed to clients or logged.
"""

import logging
from typing import List, Optional, Dict, Any
from openai import AsyncOpenAI, APIError, RateLimitError, AuthenticationError, APIConnectionError

from app.core.config import get_settings
from app.schemas.ai import ChatMessageItem

logger = logging.getLogger(__name__)
settings = get_settings()

AI_TUTOR_SYSTEM_INSTRUCTION = """You are an AI Tutor inside an e-learning platform.

Your job is to help students understand educational topics clearly.

Follow these rules:

1. Explain concepts in simple language.
2. Adapt the explanation to the student's question.
3. Use examples whenever useful.
4. Break difficult concepts into smaller steps.
5. For programming questions, provide clear examples and explain the code.
6. For mathematical questions, show the reasoning step by step.
7. If the student asks for an exam answer, provide an exam-ready structure.
8. If the student asks for a short answer, keep it concise.
9. If the student asks for detailed explanation, provide more depth.
10. Encourage understanding instead of simply giving answers.
11. Do not pretend to know information that you do not know.
12. If the question is ambiguous, ask the student for clarification.
13. Keep the tone friendly, supportive, and educational.
14. Format responses clearly using headings, bullet points, numbered lists, and code blocks where appropriate."""


class OpenAIServiceException(Exception):
    """Base exception for OpenAI service operations."""
    def __init__(self, message: str, status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class OpenAIConfigError(OpenAIServiceException):
    """Raised when OpenAI configuration (such as API key) is missing or invalid."""
    def __init__(self, message: str = "The AI Tutor is temporarily unavailable. Please try again."):
        super().__init__(message, status_code=503)


class OpenAIRateLimitError(OpenAIServiceException):
    """Raised when OpenAI rate limit is exceeded."""
    def __init__(self, message: str = "The AI Tutor is currently busy. Please try again in a moment."):
        super().__init__(message, status_code=429)


class OpenAIAuthError(OpenAIServiceException):
    """Raised when authentication with OpenAI fails."""
    def __init__(self, message: str = "The AI Tutor is temporarily unavailable. Please try again."):
        super().__init__(message, status_code=503)


class OpenAIServiceUnavailableError(OpenAIServiceException):
    """Raised when OpenAI API is temporarily unreachable or errors."""
    def __init__(self, message: str = "The AI Tutor is temporarily unavailable. Please try again."):
        super().__init__(message, status_code=503)


class OpenAIService:
    """
    Dedicated OpenAI Service for educational tutoring, explanations, and quizzes.
    """

    def __init__(self):
        self._model = settings.openai_model or "gpt-4o-mini"

    def _get_client(self) -> AsyncOpenAI:
        api_key = (settings.openai_api_key or "").strip()
        if not api_key:
            logger.error("[OpenAI] OPENAI_API_KEY is not configured in backend environment.")
            raise OpenAIConfigError("The AI Tutor is temporarily unavailable. Please try again.")
        return AsyncOpenAI(api_key=api_key)

    def _build_instructions(
        self,
        course_title: Optional[str] = None,
        lesson_title: Optional[str] = None,
        topic: Optional[str] = None,
    ) -> str:
        """Combine base tutor system instructions with course and lesson context."""
        context_parts = []
        if course_title:
            context_parts.append(f"Course: {course_title}")
        if lesson_title:
            context_parts.append(f"Lesson: {lesson_title}")
        if topic:
            context_parts.append(f"Topic: {topic}")

        if context_parts:
            context_str = "\n".join(f"- {p}" for p in context_parts)
            return (
                f"{AI_TUTOR_SYSTEM_INSTRUCTION}\n\n"
                f"### Current Student Learning Context:\n"
                f"{context_str}\n"
                f"Please tailor your explanations and examples to this context when relevant."
            )
        return AI_TUTOR_SYSTEM_INSTRUCTION

    async def generate_tutor_response(
        self,
        user_message: str,
        history: Optional[List[ChatMessageItem]] = None,
        course_title: Optional[str] = None,
        lesson_title: Optional[str] = None,
        topic: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Generate an educational response using OpenAI.
        Maintains recent conversation context and respects course context.
        """
        client = self._get_client()
        instructions = self._build_instructions(course_title, lesson_title, topic)
        model = self._model

        # Build message history for conversational context (limit to last 8 messages)
        recent_history: List[Dict[str, str]] = []
        if history:
            for item in history[-8:]:
                content = (item.content or "").strip()
                if not content:
                    continue
                role = "assistant" if item.role == "assistant" else "user"
                recent_history.append({"role": role, "content": content})

        # Try Responses API first as instructed
        try:
            try:
                # Prepare input for Responses API
                if recent_history:
                    # Input sequence of conversation turns
                    input_payload = [
                        {"role": m["role"], "content": m["content"]}
                        for m in recent_history
                    ]
                    input_payload.append({"role": "user", "content": user_message})
                else:
                    input_payload = user_message

                response = await client.responses.create(
                    model=model,
                    instructions=instructions,
                    input=input_payload,
                )

                if hasattr(response, "output_text") and response.output_text:
                    return {"answer": response.output_text, "model": model}
                elif hasattr(response, "output") and response.output:
                    return {"answer": str(response.output), "model": model}

            except Exception as resp_err:
                logger.info(f"[OpenAI] Responses API fallback to Chat Completions: {resp_err}")
                # Fallback to chat completions
                chat_messages = [{"role": "system", "content": instructions}]
                chat_messages.extend(recent_history)
                chat_messages.append({"role": "user", "content": user_message})

                completion = await client.chat.completions.create(
                    model=model,
                    messages=chat_messages,
                    temperature=0.7,
                )
                answer = completion.choices[0].message.content or ""
                return {"answer": answer, "model": model}

        except RateLimitError as exc:
            logger.warning(f"[OpenAI] Rate limit exceeded: {exc}")
            raise OpenAIRateLimitError("The AI Tutor is currently busy. Please try again in a moment.")
        except AuthenticationError as exc:
            logger.error(f"[OpenAI] Authentication failed (check OPENAI_API_KEY): {exc}")
            raise OpenAIAuthError("The AI Tutor is temporarily unavailable. Please try again.")
        except APIConnectionError as exc:
            logger.error(f"[OpenAI] Network connection to OpenAI failed: {exc}")
            raise OpenAIServiceUnavailableError("Unable to connect to AI Tutor. Please try again.")
        except APIError as exc:
            logger.error(f"[OpenAI] API error: {exc}")
            raise OpenAIServiceUnavailableError("The AI Tutor is temporarily unavailable. Please try again.")
        except OpenAIServiceException:
            raise
        except Exception as exc:
            logger.error(f"[OpenAI] Unexpected generation error: {exc}")
            raise OpenAIServiceUnavailableError("The AI Tutor is temporarily unavailable. Please try again.")
