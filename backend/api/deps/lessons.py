from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, LessonsTasks, Lesson
from services.lessons_tasks_service import LessonsTasksService
from services.lesson_service import LessonService


async def get_lesson(
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
) -> Lesson:
    return await LessonService.get_lesson(lesson_id, session)


async def get_lesson_tasks(
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[LessonsTasks]:
    return await LessonsTasksService.get_lesson_tasks(lesson_id, session)


async def get_lesson_task(
    lesson_id: int,
    task_id: int,
    session: AsyncSession = Depends(get_session)
) -> LessonsTasks:
    lesson_task = await LessonsTasksService.get_lesson_task(lesson_id, task_id, session)
    if not lesson_task:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to task")
    return lesson_task


async def get_lessons_by_course_id(
    course_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[Lesson]:
    return await LessonService.get_lessons_by_course_id(course_id, session)