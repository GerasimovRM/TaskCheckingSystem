from typing import Tuple, List

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database import TaskTest
from services.solution_service import SolutionService
from services.task_service import TaskService


class TaskTestService:
    @staticmethod
    async def get_by_task_id(task_id: int,
                                        session: AsyncSession) -> List[TaskTest]:
        task = await TaskService.get_task_by_id(task_id,
                                                session)
        return task.task_test

    @staticmethod
    async def get_by_id(task_test_id: int,
                                  session: AsyncSession) -> TaskTest:
        query = await session.execute(select(TaskTest)
                                      .where(TaskTest.id == task_test_id)
                                      .options(joinedload(TaskTest.task)))
        task_test = query.scalars().first()
        return task_test

    @staticmethod
    async def get_task_test_input_output(task_test_id,
                                         session: AsyncSession) -> Tuple[str, str]:
        task_test = await TaskTestService.get_by_id(task_test_id, session)
        return task_test.input_data, task_test.output_data.strip()
