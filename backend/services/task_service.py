from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Task
from services.lessons_tasks_service import LessonsTasksService


class TaskService:
    @staticmethod
    async def get_task_by_id(task_id: int,
                             session: AsyncSession) -> Task:
        query = await session.execute(select(Task).where(Task.id == task_id))
        task = query.scalars().first()
        return task

    @staticmethod
    async def get_tasks_by_lesson_id(lesson_id: int,
                                     session: AsyncSession) -> List[Task]:
        lesson_tasks = await LessonsTasksService.get_lesson_tasks(lesson_id,
                                                                  session)
        return list(map(lambda l_t: l_t.task, lesson_tasks))
