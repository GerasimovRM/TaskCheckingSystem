from typing import Optional, List
from fastapi import APIRouter, status, HTTPException, Depends

from services.auth_service import get_admin, get_password_hash, get_current_active_user
from database import User, Course
from models import CourseDto, UserDto, LessonDto


router = APIRouter(
    prefix="/course",
    tags=["course"]
)


@router.get("/{course_id}", response_model=CourseDto)
async def get_course(course_id: int,
                     current_user: User = Depends(get_current_active_user)) -> CourseDto:
    course = await Course.objects.get_or_none(id=course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found")
    user_course: UsersCourses = await UsersCourses.objects.get_or_none(user=current_user, course=course_id)
    if not user_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to this course")

    if user_course.user_course_role == UserCourseRole.STUDENT:
        course = await Course.objects.select_related("lessons").get(id=course_id)
        return CourseDto(**course.dict())
    elif user_course.user_course_role == UserCourseRole.OWNER or \
            user_course.user_course_role == UserCourseRole.TEACHER:
        course = await Course.objects\
            .select_related("users")\
            .select_related("lessons")\
            .fields(f"userscourses__user_course_role")\
            .get(id=course_id)

        students = list(filter(lambda u: u.userscourses.user_course_role == UserCourseRole.STUDENT,
                               course.users))
        teachers = list(filter(lambda u: u.userscourses.user_course_role == UserCourseRole.TEACHER or
                                         u.userscourses.user_course_role == UserCourseRole.OWNER,
                               course.users))
        return CourseDto(**course.dict(),
                         students=list(map(lambda s: UserDto(**s.dict()), students)),
                         teachers=list(map(lambda s: UserDto(**s.dict()), teachers)))


@router.post("/{course_id}/add_lesson", response_model=CourseDto)
async def add_lesson_to_course(course_id: int,
                               current_user: User = Depends(get_current_active_user)) -> CourseDto:
    user_course: UsersCourses = await UsersCourses.objects.get_or_none(user=current_user,
                                                                       course=course_id)
    if user_course.user_course_role not in [UserCourseRole.TEACHER, UserCourseRole.OWNER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User don't have access to edit this course")
    # TODO: add lesson to course