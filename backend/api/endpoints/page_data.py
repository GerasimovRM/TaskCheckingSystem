from fastapi import Depends, APIRouter, HTTPException, status, Cookie
from typing import Optional, List, Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import UserDto, GroupDto, UserGroupDto, LessonDto, TaskDto, CourseDto
from models.site import GroupCourseResponse
from database import User, Group, UsersGroups, Course, CoursesLessons, Lesson, get_session
from services.auth_service import get_current_active_user, get_current_user, get_password_hash
from services.auth_service import verify_password

router = APIRouter(
    prefix="/page_data",
    tags=["page_data"]
)


@router.get("/groups", response_model=List[UserGroupDto])
async def get_groups(current_user: User = Depends(get_current_active_user)) -> List[UserGroupDto]:
    groups = list(map(lambda t: t.group, current_user.groups))
    groups_dto = list(map(lambda t: GroupDto.from_orm(t), groups))
    return list(map(lambda x: UserGroupDto(**x[0].__dict__, role=x[1]),
                    zip(groups_dto, map(lambda t: t.role.name, current_user.groups))))


@router.get("/group/{group_id}/courses", response_model=List[CourseDto])
async def get_group_courses(group_id: int,
                            current_user: User = Depends(get_current_active_user)) -> List[CourseDto]:
    # check group access
    user_group = next(filter(lambda t: t.group.id == group_id, current_user.groups), None)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    group = user_group.group
    courses_dto = list(map(lambda t: CourseDto.from_orm(t.course), group.courses))
    return courses_dto


@router.get("/group/{group_id}/course/{course_id}/lessons", response_model=GroupCourseResponse)
async def get_group_course_lessons(group_id: int,
                                   course_id: int,
                                   current_user: User = Depends(get_current_active_user)) -> GroupCourseResponse:
    # check group access
    user_group = next(filter(lambda t: t.group.id == group_id, current_user.groups), None)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    group = user_group.group
    # check group access
    group_course = next(filter(lambda t: t.course.id == course_id, group.courses), None)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    course = group_course.course
    lessons_dto = list(map(lambda t: LessonDto.from_orm(t.lesson), course.lessons))
    return GroupCourseResponse(lessons=lessons_dto,
                               course_name=course.name,
                               course_description=course.description)


@router.get("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/tasks",
            response_model=List[TaskDto])
async def get_group_course_lessons_tasks(group_id: int,
                                         course_id: int,
                                         lesson_id: int,
                                         current_user: User = Depends(get_current_active_user)) -> List[TaskDto]:
    # check group access
    user_group = next(filter(lambda t: t.group.id == group_id, current_user.groups), None)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    group = user_group.group
    # check course access
    group_course = next(filter(lambda t: t.course.id == course_id, group.courses), None)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    course = group_course.course
    # check lesson access
    course_lesson = next(filter(lambda t: t.lesson.id == lesson_id, course.lessons), None)
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    lesson = course_lesson.lesson
    tasks_dto = list(map(lambda t: TaskDto.from_orm(t.task), lesson.tasks))
    return tasks_dto


@router.get("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/task/{task_id}",
            response_model=TaskDto)
async def get_group_course_lessons_task(group_id: int,
                                        course_id: int,
                                        lesson_id: int,
                                        task_id: int,
                                        current_user: User = Depends(get_current_active_user)) -> TaskDto:
    # check group access
    user_group = next(filter(lambda t: t.group.id == group_id, current_user.groups), None)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    group = user_group.group
    # check course access
    group_course = next(filter(lambda t: t.course.id == course_id, group.courses), None)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    course = group_course.course
    # check lesson access
    course_lesson = next(filter(lambda t: t.lesson.id == lesson_id, course.lessons), None)
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    lesson = course_lesson.lesson
    # check task access
    lesson_task = next(filter(lambda t: t.task.id == task_id, lesson.tasks), None)
    if not lesson_task:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to task")
    task = lesson_task.task
    return TaskDto.from_orm(task)
