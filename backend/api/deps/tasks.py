from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, LessonsTasks, Task
from services.task_service import TaskService
from models.site.task import TasksPostRequest, TaskPostRequest
from .lessons import get_lesson_task


async def get_task_by_id(
    task_id: int,
    session: AsyncSession = Depends(get_session)
) -> Task:
    return await TaskService.get_task_by_id(task_id, session)


async def get_task_by_lesson_task_id(
    lesson_task: LessonsTasks = Depends(get_lesson_task),
    session: AsyncSession = Depends(get_session)
) -> Task:
    return await TaskService.get_task_by_id(lesson_task.task_id, session)


async def get_tasks_by_lesson_id(
    lesson_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[Task]:
    return await TaskService.get_tasks_by_lesson_id(lesson_id, session)


async def create_tasks_by_json(
    tasks_json: TasksPostRequest,
    session: AsyncSession = Depends(get_session)
) -> TasksPostRequest:
    await TaskService.create_tasks_by_json(tasks_json.tasks, session)
    return tasks_json
