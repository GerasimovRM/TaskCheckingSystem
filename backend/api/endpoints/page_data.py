from io import BytesIO

from fastapi import Depends, APIRouter, HTTPException, status, UploadFile, File
from typing import List, Union

from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload
from starlette.responses import StreamingResponse

from database.solution import SolutionStatus
from models import GroupDto, UserGroupDto, LessonDto, TaskDto, CourseDto, Solution, \
    SolutionDto
from models.site import GroupCourseResponse
from database import User, Group, UsersGroups, Course, CoursesLessons, Lesson, get_session, \
    GroupsCourses, LessonsTasks, Image
from models.site.group_course_lesson_response import GroupCourseLessonResponse
from services.auth_service import get_current_active_user


router = APIRouter(
    prefix="/page_data",
    tags=["page_data"]
)


@router.get("/groups", response_model=List[UserGroupDto])
async def get_groups(current_user: User = Depends(get_current_active_user),
                     session: AsyncSession = Depends(get_session)) -> List[UserGroupDto]:
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user)
                                  .options(joinedload(UsersGroups.group)))
    user_groups = query.scalars().all()
    groups = list(map(lambda t: t.group, user_groups))
    groups_dto = list(map(lambda t: GroupDto.from_orm(t), groups))
    return list(map(lambda x: UserGroupDto(**x[0].__dict__, role=x[1]),
                    zip(groups_dto, map(lambda t: t.role.name, user_groups))))


@router.get("/group/{group_id}/courses", response_model=List[CourseDto])
async def get_group_courses(group_id: int,
                            current_user: User = Depends(get_current_active_user),
                            session: AsyncSession = Depends(get_session)) -> List[CourseDto]:
    # check group access
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user,
                                         UsersGroups.group_id == group_id))

    user_group = query.scalars().first()
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    query = await session.execute(select(Group)
        .where(Group.id == user_group.group_id)
        .options(
        joinedload(Group.courses).joinedload(GroupsCourses.course)))
    group = query.scalars().first()
    courses_dto = list(map(lambda t: CourseDto.from_orm(t.course), group.courses))
    return courses_dto


@router.get("/group/{group_id}/course/{course_id}/lessons", response_model=GroupCourseResponse)
async def get_group_course_lessons(group_id: int,
                                   course_id: int,
                                   current_user: User = Depends(get_current_active_user),
                                   session: AsyncSession = Depends(
                                       get_session)) -> GroupCourseResponse:
    # check group access
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user,
                                         UsersGroups.group_id == group_id))

    user_group = query.scalars().first()
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")

    query = await session.execute(select(GroupsCourses)
                                  .where(GroupsCourses.group_id == group_id,
                                         GroupsCourses.course_id == course_id))
    # check group access
    group_course = query.scalars().first()
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    query = await session.execute(select(Course)
        .where(Course.id == group_course.course_id)
        .options(
        joinedload(Course.lessons).joinedload(CoursesLessons.lesson)))
    course = query.scalars().first()
    lessons_dto = list(map(lambda t: LessonDto.from_orm(t.lesson), course.lessons))
    return GroupCourseResponse(lessons=lessons_dto,
                               course_name=course.name,
                               course_description=course.description)


@router.get("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/tasks",
            response_model=GroupCourseLessonResponse)
async def get_group_course_lessons_tasks(group_id: int,
                                         course_id: int,
                                         lesson_id: int,
                                         current_user: User = Depends(get_current_active_user),
                                         session: AsyncSession = Depends(
                                             get_session)) -> GroupCourseLessonResponse:
    # check group access
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user,
                                         UsersGroups.group_id == group_id))

    user_group = query.scalars().first()
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    query = await session.execute(select(GroupsCourses)
                                  .where(GroupsCourses.group_id == group_id,
                                         GroupsCourses.course_id == course_id))
    # check group access
    group_course = query.scalars().first()
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    query = await session.execute(select(CoursesLessons)
                                  .where(CoursesLessons.course_id == course_id,
                                         CoursesLessons.lesson_id == lesson_id))
    # check group access
    course_lesson = query.scalars().first()
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    query = await session.execute(select(Lesson)
                                  .where(Lesson.id == course_lesson.lesson_id)
                                  .options(joinedload(Lesson.tasks).joinedload(LessonsTasks.task)))
    lesson = query.scalars().first()
    tasks_dto = list(map(lambda t: TaskDto.from_orm(t.task), lesson.tasks))
    for task, task_dto in zip(lesson.tasks, tasks_dto):
        query = await session.execute(select(Solution)
                                      .where(Solution.group_id == group_id,
                                             Solution.course_id == course_id,
                                             Solution.user_id == current_user.id,
                                             Solution.task_id == task.task.id)
                                      .order_by(Solution.score.desc(), Solution.status.desc()))
        solution = query.scalars().first()
        if solution:
            task_dto.score = solution.score
            task_dto.status = solution.status.value
    return GroupCourseLessonResponse(tasks=tasks_dto,
                                     lesson_name=lesson.name,
                                     lesson_description=lesson.description)


@router.get("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/task/{task_id}",
            response_model=TaskDto)
async def get_group_course_lessons_task(group_id: int,
                                        course_id: int,
                                        lesson_id: int,
                                        task_id: int,
                                        current_user: User = Depends(get_current_active_user),
                                        session: AsyncSession = Depends(get_session)) -> TaskDto:
    # check group access
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user,
                                         UsersGroups.group_id == group_id))

    user_group = query.scalars().first()
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    query = await session.execute(select(GroupsCourses)
                                  .where(GroupsCourses.group_id == group_id,
                                         GroupsCourses.course_id == course_id))
    # check course access
    group_course = query.scalars().first()
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    query = await session.execute(select(CoursesLessons)
                                  .where(CoursesLessons.course_id == course_id,
                                         CoursesLessons.lesson_id == lesson_id))
    # check lesson access
    course_lesson = query.scalars().first()
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    query = await session.execute(select(LessonsTasks)
                                  .where(LessonsTasks.task_id == task_id,
                                         LessonsTasks.lesson_id == lesson_id)
                                  .options(joinedload(LessonsTasks.task)))
    lesson_task = query.scalars().first()
    if not lesson_task:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to task")
    task_dto = TaskDto.from_orm(lesson_task.task)
    query = await session.execute(select(Solution)
                                  .where(Solution.group_id == group_id,
                                         Solution.course_id == course_id,
                                         Solution.user_id == current_user.id,
                                         Solution.task_id == task_dto.id)
                                  .order_by(Solution.score.desc(), Solution.status.desc()))
    solution = query.scalars().first()
    if solution:
        task_dto.score = solution.score
        task_dto.status = solution.status
        task_dto.solution = SolutionDto.from_orm(solution)
    return task_dto


@router.post("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/task/{task_id}")
async def post_group_course_lesson_task(group_id: int,
                                        course_id: int,
                                        lesson_id: int,
                                        task_id: int,
                                        file: UploadFile = File(...),
                                        current_user: User = Depends(get_current_active_user),
                                        session: AsyncSession = Depends(get_session)):
    # check group access
    query = await session.execute(select(UsersGroups)
                                  .where(UsersGroups.user == current_user,
                                         UsersGroups.group_id == group_id))

    user_group = query.scalars().first()
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    query = await session.execute(select(GroupsCourses)
                                  .where(GroupsCourses.group_id == group_id,
                                         GroupsCourses.course_id == course_id))
    # check course access
    group_course = query.scalars().first()
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    query = await session.execute(select(CoursesLessons)
                                  .where(CoursesLessons.course_id == course_id,
                                         CoursesLessons.lesson_id == lesson_id))
    # check lesson access
    course_lesson = query.scalars().first()
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    query = await session.execute(select(LessonsTasks)
                                  .where(LessonsTasks.task_id == task_id,
                                         LessonsTasks.lesson_id == lesson_id)
                                  .options(joinedload(LessonsTasks.task)))
    lesson_task = query.scalars().first()
    if not lesson_task:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to task")

    query = await session.execute(select(Solution)
                                  .where(Solution.user_id == current_user.id,
                                         Solution.course_id == course_id,
                                         Solution.group_id == group_id,
                                         Solution.task_id == task_id))
    on_review_solutions = query.scalars().all()
    for solution in on_review_solutions:
        solution.status = SolutionStatus.ERROR
    code = await file.read()
    solution = Solution(user_id=current_user.id,
                        group_id=group_id,
                        course_id=course_id,
                        task_id=task_id,
                        code=code.decode("utf-8"))
    session.add(solution)
    await session.commit()


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
    image_bytes = BytesIO(image_db.data)
    image_bytes.seek(0)
    return StreamingResponse(image_bytes, media_type="image/png")
