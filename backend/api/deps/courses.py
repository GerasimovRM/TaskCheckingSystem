from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, CoursesLessons
from services.courses_lessons_service import CoursesLessonsService


async def get_course_lesson(
    course_id: int,
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
) -> CoursesLessons:
    course_lesson = await CoursesLessonsService.get_course_lesson(course_id,
                                                                  lesson_id,
                                                                  session)
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    return course_lesson
