from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional, List, Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from models import UserDto, GroupDto, UserGroupDto, LessonDto, TaskDto
from database import User, Group, UsersGroups, Course, CoursesLessons, Lesson, get_session
from services.auth_service import get_current_active_user, get_current_user, get_password_hash
from services.auth_service import verify_password


router = APIRouter(
    prefix="/user",
    tags=["user"]
)


@router.post("/change_password/")
async def change_password(new_password: str,
                          current_password: Optional[str] = None,
                          current_user: User = Depends(get_current_user),
                          session: AsyncSession = Depends(get_session)):
    if not current_user.password and not current_password:
        current_user.password = get_password_hash(new_password)
    elif verify_password(current_password, current_user.password):
        current_user.password = get_password_hash(new_password)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong current password")
    await session.commit()
    return {"status": "Ok"}


@router.get("/get_user_data/", response_model=UserDto)
async def get_user_data(current_user: User = Depends(get_current_user)) -> UserDto:
    return UserDto.from_orm(current_user)


@router.get("/change_user_data", response_model=UserDto)
async def change_user_data(first_name: Optional[str] = None,
                           last_name: Optional[str] = None,
                           middle_name: Optional[str] = None,
                           avatar_url: Optional[str] = None,
                           current_user: User = Depends(get_current_active_user),
                           session: AsyncSession = Depends(get_session)):
    if first_name:
        current_user.first_name = first_name
    if last_name:
        current_user.last_name = last_name
    if middle_name:
        current_user.middle_name = middle_name
    if avatar_url:
        current_user.avatar_url = avatar_url
    await session.commit()
    return UserDto.from_orm(current_user)


# TODO: придумать нормальный роут под всю таску ниже
@router.get("/groups", response_model=List[UserGroupDto])
async def get_groups(current_user: User = Depends(get_current_active_user)) -> List[UserGroupDto]:
    groups = list(map(lambda t: t.group, current_user.groups))
    groups_dto = list(map(lambda t: GroupDto.from_orm(t), groups))
    return list(map(lambda x: UserGroupDto(**x[0].__dict__, role=x[1]),
                    zip(groups_dto, map(lambda t: t.role, current_user.groups))))


@router.get("/group/{group_id}/courses", response_model=List[GroupDto])
async def get_group_courses(group_id: int,
                            current_user: User = Depends(get_current_active_user)) -> List[GroupDto]:
    # check group access
    user_group = next(filter(lambda t: t.group.id == group_id, current_user.groups), None)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")
    group = user_group.group
    courses_dto = list(map(lambda t: GroupDto.from_orm(t.course), group.courses))
    return courses_dto


@router.get("/group/{group_id}/course/{course_id}/lessons", response_model=List[LessonDto])
async def get_group_courses(group_id: int,
                            course_id: int,
                            current_user: User = Depends(get_current_active_user)) -> List[LessonDto]:
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
    return lessons_dto


@router.get("/group/{group_id}/course/{course_id}/lesson/{lesson_id}/tasks", response_model=List[TaskDto])
async def get_group_courses(group_id: int,
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

"""
@router.get("/get_course_lessons", response_model=List[LessonDto])
async def get_course_lessons(course_id: int,
                             group_id: int,
                             current_user: User = Depends(get_current_active_user)):
    user_group = await UsersGroups.objects.select_related("group").get_or_none(user=current_user,
                                                                               group=group_id)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this group")
    group = await Group.objects.select_related("courses").get(id=user_group.group)
    check_course = next(filter(lambda c: c.id == course_id, group.courses), None)
    if not check_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this course")
    course_lessons = await Course.objects.select_related("lessons").get_or_none(id=course_id)
    return list(map(lambda l: LessonDto(**l.dict()), course_lessons.lessons))
"""
"""
@router.get("/get_course_lesson_tasks")  # , response_model=List[TaskDto])
async def get_course_lessons(course_id: int,
                             group_id: int,
                             lesson_id: int,
                             current_user: User = Depends(get_current_active_user)):
    user_group = await UsersGroups.objects.select_related("group").get_or_none(user=current_user,
                                                                               group=group_id)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this group")
    group = await Group.objects.select_related("courses").get(id=user_group.group)
    check_course = next(filter(lambda c: c.id == course_id, group.courses), None)
    if not check_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this course")
    course_lesson = await LessonsCourses.objects.\
        select_related("lesson").get_or_none(course=course_id,
                                             lesson=lesson_id)
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this lesson")
    lesson_tasks = await Lesson.objects.select_related("tasks").get(id=course_lesson.lesson)
    #user_course_tasks = await UsersCoursesTasks.objects.all(user=current_user,
    #                                                        course=check_course,
    #                                                        task=)
    return lesson_tasks.tasks
"""