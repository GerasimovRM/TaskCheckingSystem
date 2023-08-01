from typing import Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, Solution, User, Task
from services.solution_service import SolutionService
from services.auth_service import get_current_active_user, get_teacher_or_admin

from .tasks import get_tasks_by_lesson_id
from .groups import get_group_students


async def get_solution(
    group_id: int,
    course_id: int,
    task_id: int,
    solution_id: int,
    user_id: Optional[int],
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> Solution:
    solution = await SolutionService.get_solution(group_id,
                                                  course_id,
                                                  task_id,
                                                  solution_id,
                                                  (user_id if user_id else current_user.id),
                                                  session)
    
    if not solution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Solution id {solution_id} not found")
    
    return solution


async def get_solution_by_id(
    solution_id: int,
    session: AsyncSession = Depends(get_session)
) -> Solution:
    solution = await SolutionService.get_solution_by_id(solution_id, session)

    if not solution:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Solution id {solution_id} not found")
    
    return solution



async def get_best_user_solutions(
    group_id: int,
    course_id: int,
    tasks: list[Task] = Depends(get_tasks_by_lesson_id),
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return [await SolutionService.get_best_user_solution(group_id,
                                                         course_id,
                                                         task.id,
                                                         current_user.id,
                                                         session) for task in tasks]


async def get_best_user_solution(
    group_id: int,
    course_id: int,
    task_id: int,
    user_id: Optional[int],
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> Solution:
    return await SolutionService.get_best_user_solution(group_id,
                                                        course_id,
                                                        task_id,
                                                        (user_id if user_id else current_user.id),
                                                        session)


async def get_user_solution_on_review(
    group_id: int,
    course_id: int,
    task_id: int,
    user_id: Optional[int],
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> Solution:
    return await SolutionService.get_user_solution_on_review(group_id,
                                                             course_id,
                                                             task_id,
                                                             (user_id if user_id else current_user.id),
                                                             session)


async def get_users_best_solutions(
    group_id: int,
    course_id: int,
    group: list[User] = Depends(get_group_students),
    tasks: list[Task] = Depends(get_tasks_by_lesson_id),
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> dict[list[Solution]]:
    solutions = {}

    for student in group:
        for task in tasks:
            if student not in solutions.keys():
                solutions[student] = [await SolutionService.get_best_user_solution(group_id,
                                                                                   course_id,
                                                                                   task.id,
                                                                                   student.id,
                                                                                   session)]
            else:
                solutions[student].append(await SolutionService.get_best_user_solution(group_id,
                                                                                       course_id,
                                                                                       task.id,
                                                                                       student.id,
                                                                                       session))
    
    return solutions


async def get_all_solutions(
    group_id: int,
    course_id: int,
    task_id: int,
    current_user: User = Depends(get_teacher_or_admin),
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return await SolutionService.get_all_solutions(group_id,
                                                   course_id,
                                                   task_id,
                                                   current_user.id,
                                                   session)


async def get_solutions_by_user_id(
    group_id: int,
    course_id: int,
    task_id: int,
    user_id: int,
    current_user: User = Depends(get_teacher_or_admin),
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return await SolutionService.get_all_solutions(group_id,
                                                   course_id,
                                                   task_id,
                                                   user_id,
                                                   session)


async def get_solutions_on_review(
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return await SolutionService.get_solutions_on_review(session)


async def get_best_solutions(
    group_id: int,
    course_id: int,
    task_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return await SolutionService.get_best_solutions(group_id, course_id, task_id, session)


async def get_solution_for_rerun_by_task_id(
    task_id: int,
    session: AsyncSession = Depends(get_session)
) -> list[Solution]:
    return await SolutionService.get_solution_for_rerun_by_task_id(task_id, session)
