from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, CoursesLessons, Course
from services.courses_lessons_service import CoursesLessonsService
from services.course_service import CourseService


async def get_course_lesson(
    course_id: int,
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
) -> CoursesLessons:
    course_lesson = await CoursesLessonsService.get_course_lesson(course_id,
                                                                  lesson_id,
                                                                  session)
    if not course_lesson:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Bad access to lesson")
    
    return course_lesson


async def get_course_lessons(
    course_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[CoursesLessons]:
    return await CoursesLessonsService.get_course_lessons(course_id, session)


async def get_course(
    course_id: int,
    session: AsyncSession = Depends(get_session)
) -> Course:
    return await CourseService.get_course(course_id, session)
