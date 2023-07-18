from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, LessonsTasks, Task
from services.task_service import TaskService
from .lessons import get_lesson_task


async def get_task_by_id(
    lesson_task: LessonsTasks = Depends(get_lesson_task),
    session: AsyncSession = Depends(get_session)
) -> Task:
    return await TaskService.get_task_by_id(lesson_task.task_id, session)
