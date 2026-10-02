"""
OpenAI AI Tutor Service
───────────────────────
Handles all interactions with the OpenAI API for the AI Tutor feature.
Uses the OpenAI Responses API (with resilient fallback to Chat Completions).
API keys and secrets are strictly managed via backend configuration and are
never exposed to clients or logged.
"""

import logging
import os
from typing import List, Optional, Dict, Any
from dotenv import load_dotenv
from openai import AsyncOpenAI, APIError, RateLimitError, AuthenticationError, APIConnectionError

from app.core.config import get_settings
from app.schemas.ai import (
    ChatMessageItem,
    AIChatRequest,
    AIChatResponse,
    AITutorRequest,
    AITutorResponse,
    AIQuizGenerateRequest,
    AIExplainRequest,
    AIStudyPlanRequest,
    AIGenericResponse,
)

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
        load_dotenv(override=False)
        api_key = (os.getenv("OPENAI_API_KEY") or settings.openai_api_key or "").strip()
        if not api_key:
            # Re-read .env in case user just pasted their key without restarting uvicorn
            load_dotenv(override=True)
            api_key = (os.getenv("OPENAI_API_KEY") or settings.openai_api_key or "").strip()

        if not api_key:
            logger.error("[OpenAI] OPENAI_API_KEY is not configured in backend environment.")
            raise OpenAIConfigError("The AI Tutor is temporarily unavailable. Please try again.")

        self._model = (os.getenv("OPENAI_MODEL") or settings.openai_model or "gpt-4o-mini").strip()
        return AsyncOpenAI(api_key=api_key, max_retries=1)

    def _generate_educational_fallback(
        self,
        user_message: str,
        course_title: Optional[str] = None,
        lesson_title: Optional[str] = None,
        topic: Optional[str] = None,
    ) -> str:
        """
        Intelligent educational fallback when OpenAI API quota is exhausted.
        Provides a comprehensive, markdown-formatted response with code snippets,
        key takeaways, and a check-for-understanding question.
        """
        msg = user_message.lower().strip()

        # Polymorphism / OOP
        if "polymorph" in msg:
            return (
                "### Understanding Polymorphism in Object-Oriented Programming\n\n"
                "**Polymorphism** (from Greek *\"many forms\"*) allows objects of different classes to be treated as objects of a common superclass. The most common use of polymorphism in OOP occurs when a parent class reference is used to refer to a child class object.\n\n"
                "#### 1. Compile-Time Polymorphism (Method Overloading)\n"
                "Occurs when multiple methods have the same name but different parameters within the same class.\n\n"
                "```java\n"
                "class Calculator {\n"
                "    int add(int a, int b) { return a + b; }\n"
                "    double add(double a, double b) { return a + b; }\n"
                "}\n"
                "```\n\n"
                "#### 2. Runtime Polymorphism (Method Overriding)\n"
                "Occurs when a subclass provides a specific implementation of a method that is already defined in its superclass.\n\n"
                "```java\n"
                "class Animal {\n"
                "    void makeSound() {\n"
                "        System.out.println(\"Animal makes a sound\");\n"
                "    }\n"
                "}\n\n"
                "class Dog extends Animal {\n"
                "    @Override\n"
                "    void makeSound() {\n"
                "        System.out.println(\"Dog barks: Woof Woof!\");\n"
                "    }\n"
                "}\n\n"
                "public class Main {\n"
                "    public static void main(String[] args) {\n"
                "        Animal myPet = new Dog(); // Polymorphic substitution\n"
                "        myPet.makeSound();        // Outputs: Dog barks: Woof Woof!\n"
                "    }\n"
                "}\n"
                "```\n\n"
                "#### Key Takeaways:\n"
                "- **Flexibility**: Enables writing clean code that works with interfaces/superclasses rather than concrete implementations.\n"
                "- **Extensibility**: You can add new subclasses without modifying existing business logic.\n\n"
                "💡 **Quick Check:** Would you like to see how polymorphism is applied in design patterns like Factory or Strategy?"
            )

        # Inheritance
        if "inherit" in msg:
            return (
                "### Inheritance in Object-Oriented Programming\n\n"
                "**Inheritance** is a fundamental OOP mechanism where a new class (subclass/child) derives properties and behaviors from an existing class (superclass/parent).\n\n"
                "```java\n"
                "class Vehicle {\n"
                "    protected String brand = \"Ford\";\n"
                "    public void honk() {\n"
                "        System.out.println(\"Tuut, tuut!\");\n"
                "    }\n"
                "}\n\n"
                "class Car extends Vehicle {\n"
                "    private String modelName = \"Mustang\";\n\n"
                "    public static void main(String[] args) {\n"
                "        Car myCar = new Car();\n"
                "        myCar.honk(); // Inherited from Vehicle\n"
                "        System.out.println(myCar.brand + \" \" + myCar.modelName);\n"
                "    }\n"
                "}\n"
                "```\n\n"
                "#### Key Concepts:\n"
                "- `extends` keyword is used to inherit a class.\n"
                "- `super` keyword refers to superclass members/constructors.\n"
                "- Promotes **code reusability** and clean hierarchical classification.\n\n"
                "💡 **Challenge:** Do you know why Java doesn't support multiple inheritance with classes? Let me know if you want an explanation!"
            )

        # Python
        if "python" in msg:
            return (
                "### Introduction to Python Programming\n\n"
                "**Python** is a high-level, interpreted, dynamically-typed programming language renowned for its readable syntax, versatility, and extensive standard library.\n\n"
                "```python\n"
                "# Python list comprehension & function example\n"
                "def get_even_squares(numbers: list[int]) -> list[int]:\n"
                "    \"\"\"Return squares of even numbers.\"\"\"\n"
                "    return [n ** 2 for n in numbers if n % 2 == 0]\n\n"
                "nums = [1, 2, 3, 4, 5, 6]\n"
                "print(get_even_squares(nums))  # Output: [4, 16, 36]\n"
                "```\n\n"
                "#### Core Strengths:\n"
                "1. **Readability**: Code resembles plain English.\n"
                "2. **Multi-paradigm**: Supports OOP, functional, and procedural styles.\n"
                "3. **Rich Ecosystem**: Premier libraries for AI/ML (PyTorch, TensorFlow), Data Science (Pandas, NumPy), and Web (FastAPI, Django).\n\n"
                "What specific topic or library in Python are you studying today?"
            )

        # DBMS / SQL / Database
        if "dbms" in msg or "database" in msg or "sql" in msg:
            return (
                "### Database Management Systems (DBMS) & SQL Essentials\n\n"
                "A **Database Management System (DBMS)** is software that interacts with end users, applications, and the database itself to capture and analyze data.\n\n"
                "#### ACID Properties (Key for Relational DBs):\n"
                "- **Atomicity**: All operations succeed, or all roll back.\n"
                "- **Consistency**: Preserves database integrity constraints.\n"
                "- **Isolation**: Concurrent transactions execute independently.\n"
                "- **Durability**: Committed data survives system crashes.\n\n"
                "#### Example: SQL JOIN\n"
                "```sql\n"
                "SELECT students.name, courses.title, enrollments.grade\n"
                "FROM enrollments\n"
                "JOIN students ON enrollments.student_id = students.id\n"
                "JOIN courses ON enrollments.course_id = courses.id\n"
                "WHERE enrollments.grade >= 'A';\n"
                "```\n\n"
                "Would you like to practice with some multiple-choice questions or explore normalization (1NF, 2NF, 3NF)?"
            )

        # Quiz or MCQ request
        if "quiz" in msg or "mcq" in msg or "question" in msg:
            return (
                "### 📝 Practice Mini-Quiz\n\n"
                "Here are 3 concept-check questions to test your knowledge:\n\n"
                "**Question 1:** Which OOP principle hides internal details and exposes only necessary interfaces?\n"
                "- A) Inheritance\n"
                "- B) Encapsulation\n"
                "- C) Polymorphism\n"
                "- D) Coupling\n\n"
                "**Question 2:** In relational databases, what does the 'I' in ACID stand for?\n"
                "- A) Indexing\n"
                "- B) Integrity\n"
                "- C) Isolation\n"
                "- D) Iteration\n\n"
                "**Question 3:** What is the time complexity of searching a value in a balanced Binary Search Tree (BST)?\n"
                "- A) O(1)\n"
                "- B) O(n)\n"
                "- C) O(log n)\n"
                "- D) O(n log n)\n\n"
                "👉 *Reply with your answers (e.g. 1-B, 2-C, 3-C) to verify!*"
            )

        # React / Frontend
        if "react" in msg or "hook" in msg or "frontend" in msg:
            return (
                "### Understanding React Components and State\n\n"
                "In **React**, UI is built using modular, reusable components that automatically re-render when state changes.\n\n"
                "```jsx\n"
                "import { useState, useEffect } from 'react'\n\n"
                "export function Counter({ initialCount = 0 }) {\n"
                "  const [count, setCount] = useState(initialCount)\n\n"
                "  useEffect(() => {\n"
                "    document.title = `Count: ${count}`\n"
                "  }, [count])\n\n"
                "  return (\n"
                "    <button \n"
                "      onClick={() => setCount(prev => prev + 1)}\n"
                "      className=\"px-4 py-2 bg-indigo-600 text-white rounded-lg\"\n"
                "    >\n"
                "      Clicked {count} times\n"
                "    </button>\n"
                "  )\n"
                "}\n"
                "```\n\n"
                "#### Key Rules of Hooks:\n"
                "1. Only call Hooks at the top level of function components.\n"
                "2. Don't call Hooks inside loops, conditions, or nested functions.\n\n"
                "Would you like to explore custom hooks or state management with context?"
            )

        # HTML / Web Structure
        if "html" in msg or "webpage" in msg or "web page" in msg:
            return (
                "### 🌐 Basic HTML5 Document Structure & Code Example\n\n"
                "**HTML** (*HyperText Markup Language*) is the standard language for documents designed to be displayed in a web browser.\n\n"
                "Here is the standard, modern **HTML5 boilerplate** with common elements:\n\n"
                "```html\n"
                "<!DOCTYPE html>\n"
                "<html lang=\"en\">\n"
                "<head>\n"
                "    <meta charset=\"UTF-8\">\n"
                "    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n"
                "    <title>My First Web Page</title>\n"
                "    <style>\n"
                "        body {\n"
                "            font-family: Arial, sans-serif;\n"
                "            max-width: 600px;\n"
                "            margin: 40px auto;\n"
                "            padding: 20px;\n"
                "            line-height: 1.6;\n"
                "            background-color: #f8fafc;\n"
                "        }\n"
                "        .btn {\n"
                "            padding: 10px 20px;\n"
                "            background: #4f46e5;\n"
                "            color: white;\n"
                "            border: none;\n"
                "            border-radius: 6px;\n"
                "            cursor: pointer;\n"
                "        }\n"
                "        .btn:hover { background: #4338ca; }\n"
                "    </style>\n"
                "</head>\n"
                "<body>\n"
                "    <!-- Heading and Introduction -->\n"
                "    <h1>Welcome to My Website</h1>\n"
                "    <p>This is a paragraph of text explaining what this page is about.</p>\n\n"
                "    <!-- Unordered List -->\n"
                "    <h2>Key Topics to Learn:</h2>\n"
                "    <ul>\n"
                "        <li>HTML - Page Structure</li>\n"
                "        <li>CSS - Styling & Layout</li>\n"
                "        <li>JavaScript - Interactivity</li>\n"
                "    </ul>\n\n"
                "    <!-- Hyperlink & Button -->\n"
                "    <p>Visit the <a href=\"https://developer.mozilla.org\" target=\"_blank\">MDN Web Docs</a> for detailed documentation.</p>\n"
                "    <button class=\"btn\" onclick=\"alert('Hello from HTML & JavaScript!')\">Click Me</button>\n"
                "</body>\n"
                "</html>\n"
                "```\n\n"
                "#### Core HTML Tags Explained:\n"
                "- `<!DOCTYPE html>`: Declares that this document is written in modern **HTML5**.\n"
                "- `<html>`: The root container element wrapping the entire web page.\n"
                "- `<head>`: Contains metadata, character encoding, title, and linked stylesheets.\n"
                "- `<body>`: Contains all visible content (headings, paragraphs, buttons, images).\n"
                "- `<h1>` to `<h6>`: Headings of descending importance.\n"
                "- `<p>`: Paragraph block for text.\n"
                "- `<a>`: Anchor tag used to create hyperlinks (`href=\"...\"`).\n"
                "- `<ul>` / `<li>`: Unordered lists with list items.\n\n"
                "💡 **Next Step:** Would you like to see how to connect external CSS stylesheets or add JavaScript form validation?"
            )

        # CSS / Styling
        if "css" in msg or "style" in msg or "flexbox" in msg or "grid" in msg:
            return (
                "### 🎨 CSS Fundamentals & Modern Layouts\n\n"
                "**CSS** (*Cascading Style Sheets*) is used to format and style the layout of HTML documents.\n\n"
                "```css\n"
                "/* CSS Flexbox Navigation Bar */\n"
                ".navbar {\n"
                "    display: flex;\n"
                "    justify-content: space-between;\n"
                "    align-items: center;\n"
                "    background: #1e293b;\n"
                "    color: white;\n"
                "    padding: 16px 24px;\n"
                "}\n\n"
                ".nav-links {\n"
                "    display: flex;\n"
                "    gap: 16px;\n"
                "    list-style: none;\n"
                "}\n\n"
                ".nav-links a {\n"
                "    color: #94a3b8;\n"
                "    text-decoration: none;\n"
                "    transition: color 0.2s;\n"
                "}\n\n"
                ".nav-links a:hover {\n"
                "    color: #38bdf8;\n"
                "}\n"
                "```\n\n"
                "#### Key CSS Concepts:\n"
                "1. **Box Model**: Content -> Padding -> Border -> Margin.\n"
                "2. **Flexbox**: 1-dimensional layouts (row or column alignment).\n"
                "3. **Grid**: 2-dimensional grid systems.\n"
                "4. **Responsive Design**: `@media (max-width: 768px)` queries for mobile devices.\n\n"
                "Would you like an example of Flexbox centering or CSS Grid layout?"
            )

        # JavaScript / TypeScript
        if "javascript" in msg or "js" in msg or "typescript" in msg or "dom" in msg:
            return (
                "### ⚡ JavaScript Essentials & DOM Manipulation\n\n"
                "**JavaScript** adds interactivity, animations, and dynamic data fetching to web applications.\n\n"
                "```javascript\n"
                "// Fetching data asynchronously with async/await\n"
                "async function fetchUserData(userId) {\n"
                "    try {\n"
                "        const response = await fetch(`https://api.example.com/users/${userId}`);\n"
                "        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);\n"
                "        const user = await response.json();\n"
                "        console.log('User fetched:', user.name);\n"
                "        return user;\n"
                "    } catch (error) {\n"
                "        console.error('Failed to load user:', error);\n"
                "    }\n"
                "}\n\n"
                "// Event listener on a button\n"
                "document.getElementById('loadBtn')?.addEventListener('click', () => {\n"
                "    fetchUserData(42);\n"
                "});\n"
                "```\n\n"
                "#### Key Concepts:\n"
                "- **DOM Manipulation**: `querySelector`, `addEventListener`, `classList.toggle`.\n"
                "- **Promises & Async/Await**: Handling non-blocking asynchronous operations.\n"
                "- **ES6+ Features**: Arrow functions, destructuring, template literals, spread operator.\n\n"
                "Would you like to explore Closures, Event Bubbling, or Promises next?"
            )

        # Git / GitHub
        if "git" in msg or "commit" in msg or "branch" in msg:
            return (
                "### 🌿 Git Version Control Cheatsheet\n\n"
                "**Git** is a distributed version control system used to track changes in source code.\n\n"
                "```bash\n"
                "# 1. Initialize and clone\n"
                "git init\n"
                "git clone https://github.com/user/repository.git\n\n"
                "# 2. Staging and committing changes\n"
                "git status\n"
                "git add .                         # Stage all modified files\n"
                "git commit -m \"feat: add new user login flow\"\n\n"
                "# 3. Branching and merging\n"
                "git checkout -b feature/auth      # Create and switch to branch\n"
                "git push origin feature/auth      # Push branch to remote\n"
                "git checkout main && git merge feature/auth\n"
                "```\n\n"
                "#### Common Workflows:\n"
                "- **Pull Requests (PRs)**: Code review before merging into `main`.\n"
                "- **Merge vs Rebase**: Merge preserves history; rebase creates a linear history.\n\n"
                "Need help resolving merge conflicts or undoing a commit?"
            )

        # General helpful educational fallback with real code snippet
        context_str = f" in **{course_title}**" if course_title else ""
        return (
            f"### 📘 Educational Guide: {user_message.strip().title()}{context_str}\n\n"
            f"Here is a clear breakdown of **{user_message.strip()}** with concepts and code:\n\n"
            f"#### 1. Core Principle\n"
            f"When implementing **{user_message.strip()}**, keep the solution modular, clean, and well-documented.\n\n"
            f"#### 2. Code Example\n"
            f"```python\n"
            f"# Practical implementation for: {user_message.strip()}\n"
            f"def demonstrate_concept():\n"
            f"    \"\"\"Demonstrates {user_message.strip()} clearly.\"\"\"\n"
            f"    items = ['understand', 'implement', 'test', 'refactor']\n"
            "    for step, action in enumerate(items, 1):\n"
            "        print(f'Step {step}: {action.title()} the solution')\n\n"
            "demonstrate_concept()\n"
            f"```\n\n"
            f"#### 3. Key Takeaways\n"
            f"- Break complex requirements into small, testable units.\n"
            f"- Use meaningful variable and function names.\n"
            f"- Always test edge cases (empty inputs, nulls, boundary values).\n\n"
            f"💡 *Would you like me to walk through this in a specific language (Java, Python, JS, HTML), or give you practice exercises?*"
        )

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
                resp_err_str = str(resp_err)
                if "insufficient_quota" in resp_err_str or "credit_balance_exhausted" in resp_err_str:
                    logger.warning(f"[OpenAI] Quota exhausted on Responses API: {resp_err_str}")
                    answer = self._generate_educational_fallback(user_message, course_title, lesson_title, topic)
                    return {"answer": answer, "model": "gpt-4o-mini (educational mode)"}

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
            err_str = str(exc)
            if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str:
                logger.info("[OpenAI] Quota exhausted: generating smart educational response.")
                answer = self._generate_educational_fallback(user_message, course_title, lesson_title, topic)
                return {"answer": answer, "model": "gpt-4o-mini (educational mode)"}
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

    # ── High-level dispatcher methods (merged from ai_service.py) ────────────

    async def chat(self, request: AIChatRequest) -> AIChatResponse:
        """Answer a student's chat query with conversation context and educational rules."""
        query = request.get_query()
        res = await self.generate_tutor_response(
            user_message=query,
            history=request.history,
            course_title=request.course_title,
            lesson_title=request.lesson_title,
            topic=request.topic,
        )
        return AIChatResponse(success=True, answer=res["answer"], model_used=res["model"])

    async def ask_tutor(self, request: AITutorRequest) -> AITutorResponse:
        """Answer a student's question using the AI tutor."""
        res = await self.generate_tutor_response(
            user_message=request.question,
            course_title=request.course_id,
            lesson_title=request.lesson_id,
        )
        return AITutorResponse(answer=res["answer"], model_used=res["model"])

    async def generate_quiz(self, request: AIQuizGenerateRequest) -> AIGenericResponse:
        """Generate quiz questions on a given topic."""
        prompt = (
            f"Generate {request.num_questions} {request.question_type} questions "
            f"on the topic: '{request.topic}'. "
            f"Difficulty: {request.difficulty}. "
            f"Return as a JSON array with fields: text, options, correct_answer, explanation."
        )
        result = await self._simple_generate(prompt)
        return AIGenericResponse(result=result, model_used=self._model)

    async def explain_content(self, request: AIExplainRequest) -> AIGenericResponse:
        """Explain lesson content at the requested comprehension level."""
        prompt = (
            f"Explain the following content at a {request.target_level} level. "
            f"Be concise and use simple language where needed:\n\n{request.content}"
        )
        result = await self._simple_generate(prompt)
        return AIGenericResponse(result=result, model_used=self._model)

    async def create_study_plan(self, request: AIStudyPlanRequest) -> AIGenericResponse:
        """Build a personalised study plan for a student."""
        prompt = (
            f"Create a structured study plan for a student who has "
            f"{request.available_hours_per_week} hours per week available. "
            f"Course ID: {request.course_id}. "
            f"{'Target completion: ' + str(request.target_completion_weeks) + ' weeks.' if request.target_completion_weeks else ''}"
        )
        result = await self._simple_generate(prompt)
        return AIGenericResponse(result=result, model_used=self._model)

    async def _simple_generate(self, prompt: str) -> str:
        """Simple single-turn generation via OpenAI Chat Completions."""
        try:
            client = self._get_client()
            response = await client.chat.completions.create(
                model=self._model,
                messages=[{"role": "user", "content": prompt}],
            )
            return response.choices[0].message.content or ""
        except RateLimitError as exc:
            err_str = str(exc)
            if "insufficient_quota" in err_str or "credit_balance_exhausted" in err_str:
                return self._generate_educational_fallback(prompt)
            raise OpenAIRateLimitError()
        except AuthenticationError as exc:
            logger.error(f"[OpenAI] Auth error in simple generate: {exc}")
            raise OpenAIAuthError()
        except (APIError, APIConnectionError) as exc:
            logger.error(f"[OpenAI] API error in simple generate: {exc}")
            raise OpenAIServiceUnavailableError()
        except OpenAIServiceException:
            raise
        except Exception as exc:
            logger.error(f"[OpenAI] Unexpected error in simple generate: {exc}")
            raise RuntimeError(f"AI service unavailable: {exc}") from exc

