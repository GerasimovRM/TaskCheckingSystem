import logging
from typing import List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Task
from models.pydantic_sqlalchemy_core import TaskDto
from models.site.task import TaskPostRequest
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

    @staticmethod
    async def create_tasks_by_json(task_json: List[TaskPostRequest],
                                   session: AsyncSession) -> None:
        for task_data in task_json:
            # logging.debug(*task_data.dict().items(),sep='\n')
            task = Task(**task_data.dict())
            session.add(task)
        await session.commit()
