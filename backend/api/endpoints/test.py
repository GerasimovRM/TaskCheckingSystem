from typing import Optional, List

from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database.users_groups import UserGroupRole, UsersGroups
from models.pydantic_sqlalchemy_core import CourseDto, CoursesLessonsDto
from models.site.course import CoursesResponse, CourseResponse, CoursePutRequest
from services.auth_service import get_current_active_user, get_admin, get_teacher_or_admin
from database import User, Course, Group, get_session, GroupsCourses
from services.course_service import CourseService
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.group_service import GroupService
from services.users_groups_service import UsersGroupsService


router = APIRouter(
    prefix="/test",
    tags=["test"]
)


@router.get("/get_all", response_model=CoursesResponse)
async def get_courses(group_id: int,
                      current_user: User = Depends(get_current_active_user),
                      session: AsyncSession = Depends(get_session)) -> CoursesResponse:
    # check group access
    user_group = await UsersGroupsService.get_user_group(user_id=current_user.id,
                                                         group_id=group_id,
                                                         session=session)

    group = await GroupService.get_group_by_id_with_courses(group_id, session)
    courses_dto = list(map(lambda t: CourseDto.from_orm(t.course), group.courses))
    return CoursesResponse(courses=courses_dto)


@router.get("/get_one", response_model=CourseResponse)
async def get_courses(group_id: int,
                      course_id: int,
                      current_user: User = Depends(get_current_active_user),
                      session: AsyncSession = Depends(get_session)) -> CourseResponse:
    # check group access
    user_group = await UsersGroupsService.get_user_group(user_id=current_user.id,
                                                         group_id=group_id,
                                                         session=session)

    group_course = await GroupsCoursesService.get_group_course_with_courses(group_id, course_id, session)
    return CourseResponse.from_orm(group_course.course)


@router.put("/", response_model=CourseResponse)
async def put_course(course_request: CoursePutRequest,
                     current_user: User = Depends(get_admin),
                     session: AsyncSession = Depends(get_session)):
    course = await CourseService.get_course(course_request.id, session)
    course.update_by_pydantic(course_request)
    await session.commit()
    return CourseResponse.from_orm(course)


@router.delete("/")
async def delete_course(course_id: int,
                        current_user: User = Depends(get_admin),
                        session: AsyncSession = Depends(get_session)):
    course = await CourseService.get_course(course_id, session)
    await session.delete(course)
    return {"detail": "ok"}


@router.post("/change_visibility", response_model=CoursesLessonsDto)
async def change_visibility(group_id: int,
                            course_id: int,
                            lesson_id: int,
                            is_hidden: bool,
                            current_user: User = Depends(get_teacher_or_admin),
                            session: AsyncSession = Depends(get_session)):
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    # TODO check access
    course_group = await GroupsCoursesService.get_group_course(group_id, course_id, session)
    # ..
    course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
    course_lesson.is_hidden = is_hidden
    await session.commit()
    return CoursesLessonsDto.from_orm(course_lesson)
