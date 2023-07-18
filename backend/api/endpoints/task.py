from io import BytesIO
from typing import Union

from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from starlette.responses import StreamingResponse

from database.solution import SolutionStatus
from database import Task
from models.pydantic_sqlalchemy_core import TaskDto, TaskTestDto
from models.site.task import TasksResponse, TaskCountForStudentResponse, \
    TaskCountForTeacherResponse, TasksPostRequest
from services.auth_service import get_current_active_user, get_admin
from database import get_session, User, LessonsTasks, Solution, Image
from api.deps import get_user_group, get_group_course, get_course_lesson, get_lesson_tasks, \
    get_lesson_task, get_by_task_id, get_task_by_lesson_task_id, create_tasks_by_json, \
    get_tasks_by_lesson_id, get_best_user_solutions, get_group_students, get_users_best_solutions

router = APIRouter(
    prefix="/task",
    tags=["task"]
)


@router.get("/get_all", response_model=TasksResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson)
])
async def get_tasks(lesson_tasks: list[LessonsTasks] = Depends(get_lesson_tasks)) -> TasksResponse:
    tasks_dto = list(map(lambda t: TaskDto(**t.task.to_dict(), task_type=t.task_type), lesson_tasks))
    return TasksResponse(tasks=tasks_dto)


@router.get("/get_one", response_model=TaskDto, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson),
])
async def get_task(lesson_task: LessonsTasks = Depends(get_lesson_task),
                   task: Task = Depends(get_task_by_lesson_task_id)) -> TaskDto:
    dto = TaskDto.from_orm(task)
    dto.task_type = lesson_task.task_type
    return dto


@router.get("/tests", response_model=list[TaskTestDto], dependencies=[
    Depends(get_current_active_user)
])
async def get_task_tests(task_tests: Task = Depends(get_by_task_id)) -> list[TaskTestDto]:
    return list(map(lambda task_test: TaskTestDto.from_orm(task_test), task_tests))


@router.put("/", dependencies=[
    Depends(get_admin)
])
async def put_tasks(tasks_json: TasksPostRequest = Depends(create_tasks_by_json)):
    return TasksPostRequest.from_orm(tasks_json)


# TODO: надо что-то с image придумать
@router.post("/upload_image")
async def upload_image(file: UploadFile = File(...),
                       session: AsyncSession = Depends(get_session)):
    data = await file.read()
    image = Image(data=data)
    session.add(image)
    await session.commit()


@router.get("/load_image")
async def load_image(image_id: Union[str, int],
                     session: AsyncSession = Depends(get_session)):
    query = await session.execute(select(Image)
                                  .where(Image.id == f"{image_id}"))
    image_db = query.scalars().first()
    if not image_db:
        return
    image_bytes = BytesIO(image_db.data)
    image_bytes.seek(0)
    return StreamingResponse(image_bytes, media_type="image/png")


@router.get("/get_count_for_student", response_model=TaskCountForStudentResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson)
])
async def get_task_count(solutions: list[Solution] = Depends(get_best_user_solutions)):
    tasks_complete_count = 0
    tasks_complete_not_max_count = 0
    tasks_complete_error_count = 0
    tasks_complete_on_review_count = 0
    tasks_undefined_count = 0

    for solution in solutions:
        if not solution:
            tasks_undefined_count += 1
        elif solution.status == SolutionStatus.ERROR:
            tasks_complete_error_count += 1
        elif solution.status == SolutionStatus.ON_REVIEW:
            tasks_complete_on_review_count += 1
        elif solution.status == SolutionStatus.COMPLETE_NOT_MAX:
            tasks_complete_not_max_count += 1
        elif solution.status == SolutionStatus.COMPLETE:
            tasks_complete_count += 1
        else:
            raise AttributeError("Task not detect!")

    return TaskCountForStudentResponse(tasks_count=len(solutions),
                                       tasks_complete_count=tasks_complete_count,
                                       tasks_complete_not_max_count=tasks_complete_not_max_count,
                                       tasks_complete_error_count=tasks_complete_error_count,
                                       tasks_complete_on_review_count=tasks_complete_on_review_count,
                                       tasks_undefined_count=tasks_undefined_count,
                                       )


@router.get("/get_count_for_teacher", response_model=TaskCountForTeacherResponse, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson)
])
async def get_task_count_for_teacher(group_students: list[User] = Depends(get_group_students),
                                     tasks: list[Task] = Depends(get_tasks_by_lesson_id),
                                     solutions: dict[list[Solution]] = Depends(get_users_best_solutions)):
    students = list(map(lambda g_u: g_u.user, group_students))
    students_with_all_completed_tasks = 0

    if not tasks:
        return TaskCountForTeacherResponse(
            students_count=len(students),
            students_with_all_completed_tasks=0
        )

    for student in solutions:
        is_all = True

        for solution in solutions[student]:
            if solution and solution.status != SolutionStatus.COMPLETE:
                is_all = False
                break
            elif not solution:
                is_all = False
                break

        if is_all:
            students_with_all_completed_tasks += 1

    return TaskCountForTeacherResponse(
        students_count=len(students),
        students_with_all_completed_tasks=students_with_all_completed_tasks
    )
