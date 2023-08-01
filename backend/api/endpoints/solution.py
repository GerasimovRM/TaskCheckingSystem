from fastapi import Depends, APIRouter, UploadFile, File
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession

from database.solution import SolutionStatus, Solution
from database import User, get_session, Task
from models.pydantic_sqlalchemy_core import SolutionDto
from models.site.solution import SolutionsCountResponse, SolutionResponse
from services.auth_service import get_current_active_user, get_admin, get_teacher_or_admin
from services.solution_service import SolutionService
from services.task_service import TaskService
from api.deps import get_all_solutions, get_solutions_by_user_id, get_group_students, get_best_solutions, \
    get_best_user_solution, get_user_solution_on_review, get_solution, get_solution_by_id, get_user_group, \
    get_group_course, get_course_lesson, get_lesson_task, get_solutions_on_review, \
    get_solution_for_rerun_by_task_id, get_tasks_by_lesson_id


router = APIRouter(
    prefix="/solution",
    tags=["solution"]
)


@router.get("/get_all_task_solutions", response_model=List[SolutionDto])
async def get_all_task_solutions(solutions: list[Solution] = Depends(get_all_solutions)) -> List[SolutionDto]:
    return list(map(SolutionDto.from_orm, solutions))


@router.get("/get_all_task_solutions_by_user_id", response_model=List[SolutionDto])
async def get_all_task_solutions_by_user_id(solutions: list[Solution] = Depends(get_solutions_by_user_id)) -> List[SolutionDto]:
    return list(map(SolutionDto.from_orm, solutions))


@router.get("/get_count", response_model=Optional[SolutionsCountResponse], dependencies=[
    Depends(get_teacher_or_admin)
])
async def get_solution_count(user_groups: list[User] = Depends(get_group_students),
                             solutions: list[Solution] = Depends(get_best_solutions)) -> Optional[SolutionsCountResponse]:
    solutions_count = len(user_groups)

    solutions_complete_count = len(
        list(filter(lambda sol: sol.status == SolutionStatus.COMPLETE, solutions)))
    solutions_complete_not_max_count = len(
        list(filter(lambda sol: sol.status == SolutionStatus.COMPLETE_NOT_MAX, solutions)))
    solutions_complete_error_count = len(
        list(filter(lambda sol: sol.status == SolutionStatus.ERROR, solutions)))
    solutions_complete_on_review_count = len(
        list(filter(lambda sol: sol.status == SolutionStatus.ON_REVIEW, solutions)))
    
    solutions_undefined_count = solutions_count \
                                - solutions_complete_count \
                                - solutions_complete_not_max_count \
                                - solutions_complete_error_count \
                                - solutions_complete_on_review_count

    return SolutionsCountResponse(solutions_count=solutions_count,
                                  solutions_complete_count=solutions_complete_count,
                                  solutions_complete_not_max_count=solutions_complete_not_max_count,
                                  solutions_complete_error_count=solutions_complete_error_count,
                                  solutions_complete_on_review_count=solutions_complete_on_review_count,
                                  solutions_undefined_count=solutions_undefined_count)


@router.get("/get_best", response_model=Optional[SolutionResponse])
async def get_solution_best(solution: Solution = Depends(get_best_user_solution),
                            solution_on_review: Solution = Depends(get_user_solution_on_review)) -> Optional[SolutionResponse]:
    if solution:
        return SolutionResponse.from_orm(solution)

    if solution_on_review:
        return SolutionResponse.from_orm(solution_on_review)


@router.get("/get_one", response_model=Optional[SolutionResponse])
async def get_solution(solution: Solution = Depends(get_solution)) -> Optional[SolutionResponse]:
    return SolutionResponse.from_orm(solution)


@router.post("/change_score", response_model=SolutionResponse, dependencies=[
    Depends(get_admin)
])
async def change_solution_score(solution: Solution = Depends(get_solution_by_id),
                                new_score: Optional[int] = 0,
                                is_rework: bool = False,
                                session: AsyncSession = Depends(get_session)):
    if is_rework or new_score == 0:
        solution.score = 0
        solution.status = SolutionStatus.ERROR
    else:
        solution.score = new_score
        if new_score == solution.task.max_score:
            solution.status = SolutionStatus.COMPLETE
        else:
            solution.status = SolutionStatus.COMPLETE_NOT_MAX

    await session.commit()
    return SolutionResponse.from_orm(solution)


@router.put("/", response_model=SolutionDto, dependencies=[
    Depends(get_current_active_user)
])
async def put_solution(solution: SolutionDto,
                       session: AsyncSession = Depends(get_session)):
    solution_orm = await SolutionService.get_solution_by_id(solution.id, session)  # TODO: как засунуть это в depend D:
    solution_orm.update_by_pydantic(solution)

    await session.commit()
    return SolutionDto.from_orm(solution_orm)


@router.post("/post_file", response_model=SolutionResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson),
    Depends(get_lesson_task)
])
async def post_solution(group_id: int,
                        course_id: int,
                        task_id: int,
                        file: UploadFile = File(...),
                        last_solution: Solution = Depends(get_user_solution_on_review),
                        current_user: User = Depends(get_current_active_user),
                        session: AsyncSession = Depends(get_session)):
    if last_solution:
        last_solution.status = SolutionStatus.ERROR

    code = await file.read()
    task = await TaskService.get_task_by_id(task_id, session)
    solution = Solution(user_id=current_user.id,
                        group_id=group_id,
                        course_id=course_id,
                        task_id=task_id,
                        code=code.decode("utf-8"),
                        test_type=task.test_type)
    session.add(solution)
    await session.commit()
    # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))
    return SolutionResponse.from_orm(solution)


@router.post("/post_code", response_model=SolutionResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson),
    Depends(get_lesson_task)
])
async def post_solution(group_id: int,
                        course_id: int,
                        task_id: int,
                        code: str,
                        last_solution: Solution = Depends(get_user_solution_on_review),
                        current_user: User = Depends(get_current_active_user),
                        session: AsyncSession = Depends(get_session)):
    if last_solution:
        last_solution.status = SolutionStatus.ERROR

    task = await TaskService.get_task_by_id(task_id, session)
    solution = Solution(user_id=current_user.id,
                        group_id=group_id,
                        course_id=course_id,
                        task_id=task_id,
                        code=code,
                        test_type=task.test_type)
    session.add(solution)
    await session.commit()
    # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))
    return SolutionResponse.from_orm(solution)


@router.delete("/", dependencies=[
    Depends(get_admin)
])
async def delete_solution(solution: Solution = Depends(get_solution_by_id),
                          session: AsyncSession = Depends(get_session)):
    await session.delete(solution)
    return {"detail": "ok"}


@router.post("/rerun_solution_on_review", dependencies=[
    Depends(get_teacher_or_admin)
])
async def rerun_solution_on_review(solutions: list[Solution] = Depends(get_solutions_on_review),
                                   session: AsyncSession = Depends(get_session)):
    for solution in solutions:
        task = await TaskService.get_task_by_id(solution.task_id, session)
        # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))
    return {"detail": "ok"}


@router.post("/rerun_solutions_by_task_id", dependencies=[
    Depends(get_teacher_or_admin)
])
async def rerun_solutions_by_task_id(solutions: list[Solution] = Depends(get_solution_for_rerun_by_task_id),
                                     session: AsyncSession = Depends(get_session)):
    for solution in solutions:
        solution.status = SolutionStatus.ON_REVIEW
        solution.score = 0
        await session.commit()
        task = await TaskService.get_task_by_id(solution.task_id, session)
        # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))


@router.post("/rerun_solutions_by_lesson_id", dependencies=[
    Depends(get_teacher_or_admin)
])
async def rerun_solutions_by_task_id(tasks: list[Task] = Depends(get_tasks_by_lesson_id),
                                     session: AsyncSession = Depends(get_session)):
    for task in tasks:
        solutions = await SolutionService.get_solution_for_rerun_by_task_id(task.id, session)
        for solution in solutions:
            solution.status = SolutionStatus.ON_REVIEW
            solution.score = 0
            await session.commit()
            task = await TaskService.get_task_by_id(solution.task_id, session)
            # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))


@router.post("/rerun_solution_by_id", dependencies=[
    Depends(get_teacher_or_admin)
])
async def rerun_solutions_by_task_id(solution: Solution=Depends(get_solution_by_id),
                                     session: AsyncSession = Depends(get_session)):
    solution.status = SolutionStatus.ON_REVIEW
    solution.score = 0
    await session.commit()
    task = await TaskService.get_task_by_id(solution.task_id, session)
    # await TaskCheckerProducer.produce(SolutionForTaskChecker(**solution.to_dict(), max_score=task.max_score))
