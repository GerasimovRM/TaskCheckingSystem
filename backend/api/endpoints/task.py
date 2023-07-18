from io import BytesIO
from typing import Optional, List, Union

from fastapi import APIRouter, status, HTTPException, Depends, UploadFile, File
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette.responses import StreamingResponse

from database.solution import SolutionStatus
from database.users_groups import UserGroupRole, UsersGroups
from database import Task
from models.pydantic_sqlalchemy_core import TaskDto, TaskTestDto
from models.site.group import GroupsResponse
from models.site.task import TasksResponse, TaskCountForStudentResponse, \
    TaskCountForTeacherResponse, TasksPostRequest
from services.auth_service import get_current_active_user, get_admin, get_teacher_or_admin
from database import User, Group, get_session, GroupsCourses, CoursesLessons, Lesson, LessonsTasks, \
    Solution, Image, ChatMessage, TaskTest
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lessons_tasks_service import LessonsTasksService
from services.solution_service import SolutionService
from services.task_service import TaskService
from services.test_solution_service import TaskTestService
from services.users_groups_service import UsersGroupsService
from api.deps import get_user_group, get_group_course, get_course_lesson, get_lesson_tasks, get_lesson_task, get_task_by_id

router = APIRouter(
    prefix="/task",
    tags=["task"]
)


@router.get("/get_all",
            response_model=TasksResponse,
            dependencies=[Depends(get_user_group), Depends(get_group_course), Depends(get_course_lesson)])
async def get_tasks(lesson_tasks: List[LessonsTasks] = Depends(get_lesson_tasks)) -> TasksResponse:
    tasks_dto = list(
        map(lambda t: TaskDto(**t.task.to_dict(), task_type=t.task_type), lesson_tasks))
    return TasksResponse(tasks=tasks_dto)


@router.get("/get_one", response_model=TaskDto, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson),
])
async def get_task(
    lesson_task: LessonsTasks = Depends(get_lesson_task),
    task: Task = Depends(get_task_by_id)
) -> TaskDto:
    dto = TaskDto.from_orm(task)
    dto.task_type = lesson_task.task_type
    return dto


@router.get("/tests", response_model=List[TaskTestDto])
async def get_task_tests(task_id: int,
                         current_user: User = Depends(get_current_active_user),
                         session: AsyncSession = Depends(get_session)):
    task_tests = await TaskTestService.get_by_task_id(task_id, session)
    return list(map(lambda task_test: TaskTestDto.from_orm(task_test), task_tests))


@router.put("/")
async def put_tasks(tasks_json: TasksPostRequest,
                    current_user: User = Depends(get_admin),
                    session: AsyncSession = Depends(get_session)):
    await TaskService.create_tasks_by_json(tasks_json.tasks, session)


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


@router.get("/get_count_for_student", response_model=TaskCountForStudentResponse)
async def get_task_count(group_id: int,
                         course_id: int,
                         lesson_id: int,
                         current_user: User = Depends(get_current_active_user),
                         session: AsyncSession = Depends(get_session)):
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    # TODO check access
    course_group = await GroupsCoursesService.get_group_course(group_id, course_id, session)
    # ..
    course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)

    tasks = await TaskService.get_tasks_by_lesson_id(lesson_id, session)
    tasks_complete_count = 0
    tasks_complete_not_max_count = 0
    tasks_complete_error_count = 0
    tasks_complete_on_review_count = 0
    tasks_undefined_count = 0
    for task in tasks:
        solution = await SolutionService.get_best_user_solution(group_id,
                                                                course_id,
                                                                task.id,
                                                                current_user.id,
                                                                session)
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

    return TaskCountForStudentResponse(tasks_count=len(tasks),
                                       tasks_complete_count=tasks_complete_count,
                                       tasks_complete_not_max_count=tasks_complete_not_max_count,
                                       tasks_complete_error_count=tasks_complete_error_count,
                                       tasks_complete_on_review_count=tasks_complete_on_review_count,
                                       tasks_undefined_count=tasks_undefined_count,
                                       )


@router.get("/get_count_for_teacher", response_model=TaskCountForTeacherResponse)
async def get_task_count_for_teacher(group_id: int,
                                     course_id: int,
                                     lesson_id: int,
                                     current_user: User = Depends(get_teacher_or_admin),
                                     session: AsyncSession = Depends(get_session)):
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    # TODO check access
    course_group = await GroupsCoursesService.get_group_course(group_id, course_id, session)
    # ..
    course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)

    tasks = await TaskService.get_tasks_by_lesson_id(lesson_id, session)
    group_students = await UsersGroupsService.get_group_students(group_id, session)
    students = list(map(lambda g_u: g_u.user, group_students))
    students_count = len(students)
    students_with_all_completed_tasks = 0
    if tasks:
        for student in students:
            student: User
            is_all = True

            for task in tasks:
                best_solution = await SolutionService \
                    .get_best_user_solution(group_id,
                                            course_id,
                                            task.id,
                                            student.id,
                                            session)
                if best_solution and best_solution.status != SolutionStatus.COMPLETE:
                    is_all = False
                    break
                elif not best_solution:
                    is_all = False
                    break
            if is_all:
                students_with_all_completed_tasks += 1
    else:
        students_with_all_completed_tasks = 0

    return TaskCountForTeacherResponse(students_count=students_count,
                                       students_with_all_completed_tasks=students_with_all_completed_tasks)
