import re
import uuid
from typing import Optional, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.course import Course, CourseStatus
from app.schemas.course import CourseCreate, CourseUpdate


def _slugify(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r"[^\w\s-]", "", slug)
    slug = re.sub(r"[\s_-]+", "-", slug)
    return slug + "-" + str(uuid.uuid4())[:8]


class CourseService:

    @staticmethod
    async def create_course(
        db: AsyncSession, data: CourseCreate, instructor_id: uuid.UUID
    ) -> Course:
        course = Course(
            title=data.title,
            slug=_slugify(data.title),
            description=data.description,
            short_description=data.short_description,
            price=data.price,
            level=data.level,
            is_free=data.is_free,
            language=data.language,
            instructor_id=instructor_id,
            category_id=data.category_id,
        )
        db.add(course)
        await db.flush()
        return course

    @staticmethod
    async def get_course(db: AsyncSession, course_id: uuid.UUID) -> Optional[Course]:
        result = await db.execute(select(Course).where(Course.id == course_id))
        return result.scalar_one_or_none()

    @staticmethod
    async def list_published_courses(db: AsyncSession, skip: int = 0, limit: int = 20) -> List[Course]:
        result = await db.execute(
            select(Course)
            .where(Course.status == CourseStatus.PUBLISHED)
            .offset(skip)
            .limit(limit)
        )
        return list(result.scalars().all())

    @staticmethod
    async def update_course(
        db: AsyncSession, course_id: uuid.UUID, data: CourseUpdate, instructor_id: uuid.UUID
    ) -> Optional[Course]:
        course = await CourseService.get_course(db, course_id)
        if not course or str(course.instructor_id) != str(instructor_id):
            return None
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(course, field, value)
        await db.flush()
        return course

    @staticmethod
    async def delete_course(
        db: AsyncSession, course_id: uuid.UUID, instructor_id: uuid.UUID
    ) -> bool:
        course = await CourseService.get_course(db, course_id)
        if not course or str(course.instructor_id) != str(instructor_id):
            return False
        await db.delete(course)
        return True
