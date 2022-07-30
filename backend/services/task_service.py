from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Task


class TaskService:
    @staticmethod
    async def get_task_by_id(task_id: int,
                             session: AsyncSession) -> Task:
        query = await session.execute(select(Task).where(Task.id == task_id))
        task = query.scalars().first()
        return task
