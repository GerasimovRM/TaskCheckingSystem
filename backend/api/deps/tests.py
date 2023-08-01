from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, TaskTest
from services.test_solution_service import TaskTestService


async def get_by_task_id(
    task_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[TaskTest]:
    task_tests = await TaskTestService.get_by_task_id(task_id, session)

    if not task_tests:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Task id {task_id} not found")
    
    return task_tests
