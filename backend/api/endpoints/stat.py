from typing import Optional, List

from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database.solution import SolutionStatus
from database.users_groups import UserGroupRole, UsersGroups
from models.pydantic_sqlalchemy_core import LessonDto
from models.site.lesson import LessonsResponse, LessonResponse, LessonPostRequest, LessonRequest
from models.site.stat import CourseStatForStudent, TaskStat, LessonStat, UserStat, CourseStatForTeacher
from services.auth_service import get_current_active_user, get_teacher_or_admin
from database import User, Group, get_session, GroupsCourses, Course, CoursesLessons, Lesson, \
    Solution
from services.course_service import CourseService
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lesson_service import LessonService
from services.solution_service import SolutionService
from services.task_service import TaskService
from services.users_groups_service import UsersGroupsService

router = APIRouter(
    prefix="/stat",
    tags=["stat"]
)


@router.get("/get_course_stat_for_student", response_model=CourseStatForStudent)
async def get_course_stat_for_student(group_id: int,
                                      course_id: int,
                                      current_user: User = Depends(get_current_active_user),
                                      session: AsyncSession = Depends(
                                          get_session)) -> CourseStatForStudent:
    # check group access
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")

    group_course = await GroupsCoursesService.get_group_course(group_id,
                                                               course_id,
                                                               session)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    course = await CourseService.get_course(course_id, session)
    course_lessons = await CoursesLessonsService.get_course_lessons(course_id, session)
    lessons = list(map(lambda c_l: c_l.lesson, course_lessons))
    lessons_dto = []
    for lesson in lessons:
        tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
        best_solutions = [await SolutionService.get_best_user_solution(group_id,
                                                                       course_id,
                                                                       task.id,
                                                                       current_user.id,
                                                                       session) for task in tasks]
        tasks_dto = [(TaskStat(**task.to_dict() | ({"best_score": solution.score,
                                                    "status": solution.status} if solution else
                                                   {"best_score": 0,
                                                    "status": SolutionStatus.NOT_SENT})))
                     for task, solution in zip(tasks, best_solutions)]

        lesson_dto = LessonStat(**lesson.to_dict() | {"tasks": tasks_dto})
        lessons_dto.append(lesson_dto)
    course_dto = CourseStatForStudent.parse_obj(course.to_dict() | {"lessons": lessons_dto})

    return course_dto


@router.get("/get_course_stat_for_teacher", response_model=CourseStatForStudent)
async def get_course_stat_for_student(group_id: int,
                                      course_id: int,
                                      current_user: User = Depends(get_current_active_user),
                                      session: AsyncSession = Depends(
                                          get_session)) -> CourseStatForStudent:
    # check group access
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    if not user_group or user_group.role == UserGroupRole.STUDENT:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group")

    group_course = await GroupsCoursesService.get_group_course(group_id,
                                                               course_id,
                                                               session)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    course = await CourseService.get_course(course_id, session)
    course_lessons = await CoursesLessonsService.get_course_lessons(course_id, session)
    lessons = list(map(lambda c_l: c_l.lesson, course_lessons))
    # TODO: need to optimize
    group_users = await UsersGroupsService.get_group_users(group_id, session)
    users = list(map(lambda g_u: g_u.user, group_users))
    users_dto = []
    for user in users:
        lessons_dto = []
        for lesson in lessons:
            tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
            best_solutions = [await SolutionService.get_best_user_solution(group_id,
                                                                           course_id,
                                                                           task.id,
                                                                           user.id,
                                                                           session) for task in tasks]
            tasks_dto = [(TaskStat(**task.to_dict() | ({"best_score": solution.score,
                                                        "status": solution.status} if solution else
                                                       {"best_score": 0,
                                                        "status": SolutionStatus.NOT_SENT})))
                         for task, solution in zip(tasks, best_solutions)]

            lesson_dto = LessonStat(**lesson.to_dict() | {"tasks": tasks_dto})
            lessons_dto.append(lesson_dto)
        user_dto = UserStat(**user.to_dict() | {"lessons": lessons_dto})
        users_dto.append(user_dto)
    return CourseStatForTeacher(**course.to_dict() | {"users": users_dto})
