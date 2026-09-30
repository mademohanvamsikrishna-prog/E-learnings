"""
Stub service files — these will be implemented in future iterations.
Each follows the same Service → Model → DB pattern established in auth_service and course_service.
"""


class UserService:
    """Handles user profile reads and updates."""
    pass


class LessonService:
    """Handles lesson CRUD and content URL management."""
    pass


class QuizService:
    """Handles quiz creation, question management, and attempt grading."""
    pass


class AssignmentService:
    """Handles assignment creation and submission grading."""
    pass


class ProgressService:
    """Tracks lesson completion and recalculates enrollment progress percentage."""
    pass


class CertificateService:
    """Generates and stores completion certificates."""
    pass
