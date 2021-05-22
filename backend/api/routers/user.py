from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional, List

from models import UserDto, CourseDto, LessonDto, TaskDto
from database import User, Course, UsersCourses, LessonsCourses, LessonsTasks, Lesson
from services.auth_service import get_current_active_user, get_current_user, get_password_hash
from services.auth_service import verify_password
from database.users_courses import UserCourseRole


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


@router.get("/get_user_data/", response_model=UserDto)
async def get_user_data(current_user: User = Depends(get_current_user)) -> UserDto:
    return UserDto(**current_user.dict())


@router.get("/change_user_data", response_model=UserDto)
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


@router.get("/get_courses", response_model=List[CourseDto])
async def get_courses(user_course_role: Optional[UserCourseRole],
                      current_user: User = Depends(get_current_active_user)):
    users_courses = await UsersCourses.objects.select_related("course").all(user=current_user.id,
                                                                            user_course_role=int(user_course_role))
    courses = list(map(lambda t: CourseDto(**t.course.dict()), users_courses))
    return courses


@router.get("/get_course_lessons", response_model=List[LessonDto])
async def get_course_lessons(course_id: int,
                             current_user: User = Depends(get_current_active_user)):
    users_courses = await UsersCourses.objects.get_or_none(user=current_user.id,
                                                           course=course_id)
    if not users_courses:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this course")

    lessons_courses = await LessonsCourses.objects.select_related("lesson").all(course=course_id)
    lessons = list(map(lambda t: LessonDto(**t.lesson.dict()), lessons_courses))
    return lessons


@router.get("/get_lesson_tasks")
async def get_lesson_tasks(course_id: int,
                           lesson_id: int,
                           current_user: User = Depends(get_current_active_user)):
    users_courses = await UsersCourses.objects.select_related("course").get_or_none(user=current_user.id,
                                                                                    course=course_id)
    if not users_courses:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this course")

    lesson_course = await LessonsCourses.objects.select_related("lesson").get_or_none(course=course_id,
                                                                                      lesson=lesson_id)
    if not lesson_course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Lesson not found in this course")

    lesson = lesson_course.lesson
    lesson_tasks = await LessonsTasks.objects.select_related("task").all(lesson=lesson.id)
    tasks = list(map(lambda t: t.task, lesson_tasks))
    tasks_grades_and_statuses = []
    # for task in tasks:


