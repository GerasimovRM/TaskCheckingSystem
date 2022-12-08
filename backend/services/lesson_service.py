import logging
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Lesson
from services.courses_lessons_service import CoursesLessonsService


class LessonService:
    @staticmethod
    async def get_lesson(lesson_id: int,
                         session: AsyncSession) -> Lesson:
        query = await session.execute(select(Lesson)
                                      .where(Lesson.id == lesson_id))
        lesson = query.scalars().first()
        return lesson

    @staticmethod
    async def get_lessons_by_course_id(course_id: int,
                                       session: AsyncSession) -> List[Lesson]:
        course_lessons = await CoursesLessonsService.get_course_lessons(course_id, session)
        lessons = list(map(lambda c_l: c_l.lesson, course_lessons))
        logging.debug(lessons)
        return lessons
