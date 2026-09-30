"""
Stub API routers — will be implemented feature-by-feature.
Each router follows the same pattern: Router → Schema validation → Service → DB.
"""
from fastapi import APIRouter

# ─── Users ───────────────────────────────────────────────────────────────────────
router_users = APIRouter(prefix="/users", tags=["Users"])

@router_users.get("/me")
async def get_me():
    return {"message": "Get current user — implementation pending"}


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
