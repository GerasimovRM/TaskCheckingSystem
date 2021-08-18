from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional, List
import itertools

from models import UserDto, CourseDto, LessonDto, TaskDto, UserGroupDto, GroupDto
from database import User, Group, UsersGroups, CoursesGroups, Course, LessonsCourses, Lesson, UsersTasks
from services.auth_service import get_current_active_user, get_current_user, get_password_hash
from services.auth_service import verify_password


router = APIRouter(
    prefix="/user",
    tags=["user"]
)


@router.post("/change_password/")
async def change_password(new_password: str,
                          current_password: Optional[str] = None,
                          current_user: User = Depends(get_current_user)):
    if not current_user.password and not current_password:
        current_user.password = get_password_hash(new_password)
    elif verify_password(current_password, current_user.password):
        current_user.password = get_password_hash(new_password)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong current password")
    await current_user.update()
    return {"status": "Ok"}


@router.get("/user_data/", response_model=UserDto)
async def get_user_data(current_user: User = Depends(get_current_user)) -> UserDto:
    return UserDto(**current_user.dict())


@router.post("/user_data", response_model=UserDto)
async def change_user_data(first_name: Optional[str] = None,
                           last_name: Optional[str] = None,
                           middle_name: Optional[str] = None,
                           avatar_url: Optional[str] = None,
                           current_user: User = Depends(get_current_active_user)):
    if first_name:
        current_user.first_name = first_name
    if last_name:
        current_user.last_name = last_name
    if middle_name:
        current_user.middle_name = middle_name
    if avatar_url:
        current_user.avatar_url = avatar_url
    await current_user.update()
    return UserDto(**current_user.dict())


@router.get("/groups") #, response_model=List[UserGroupDto])
async def get_groups(current_user: User = Depends(get_current_active_user)):
    user_groups = await UsersGroups.objects.select_related("group").all(user=current_user)
    groups = [await Group.objects.get(id=g.group) for g in user_groups]
    return list(map(lambda x: GroupDto(**x.dict()), groups))


"""
@router.get("/course_lessons", response_model=List[LessonDto])
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