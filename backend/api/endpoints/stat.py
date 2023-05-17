from typing import Optional, List

from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database.solution import SolutionStatus
from database.users_groups import UserGroupRole, UsersGroups
from models.pydantic_sqlalchemy_core import LessonDto, UserDto
from models.site.lesson import LessonsResponse, LessonResponse, LessonPostRequest, LessonRequest
from models.site.stat import CourseStatForStudent, TaskStat, LessonStat, UserStat, \
    CourseStatForTeacher, \
    TableDataForTeacher, LessonDataForTeacher, TaskLessonDataForTeacher, TaskStudentDataForTeacher, \
    StudentTaskDataForTeacher, RatingGroupForTeacher, RatingStudentForTeacher
from services.auth_service import get_current_active_user, get_teacher_or_admin, get_teacher
from database import User, Group, get_session, GroupsCourses, Course, CoursesLessons, Lesson, \
    Solution
from services.course_service import CourseService
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lesson_service import LessonService
from services.solution_service import SolutionService
from services.task_service import TaskService
from services.user_service import UserService
from services.users_groups_service import UsersGroupsService

router = APIRouter(
    prefix="/stat",
    tags=["stat"]
)


@router.get("/get_table_for_teacher", response_model=TableDataForTeacher)
async def get_table_for_teacher(group_id: int,
                                course_id: int,
                                current_user: User = Depends(get_teacher),
                                session: AsyncSession = Depends(
                                    get_session)) -> TableDataForTeacher:
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    if user_group.role == UserGroupRole.STUDENT or not user_group:
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

    lessons = await LessonService.get_lessons_by_course_id(course_id, session)
    lessons_dto: List[LessonDataForTeacher] = []
    for lesson in lessons:
        tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
        tasks_dto = list(map(lambda task: TaskLessonDataForTeacher(task_id=task.id,
                                                                   task_name=task.name,
                                                                   max_score=task.max_score),
                             tasks))
        lesson_dto = LessonDataForTeacher(lesson_id=lesson.id,
                                          lesson_name=lesson.name,
                                          tasks=tasks_dto)
        lessons_dto.append(lesson_dto)

    students = await UserService.get_students_by_group_id(group_id, session)
    students_dto: List[StudentTaskDataForTeacher] = []
    # need to optimize
    for student in students:
        tasks_dto = []
        for lesson in lessons:
            tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
            best_solutions = [await SolutionService.get_best_user_solution(group_id,
                                                                           course_id,
                                                                           task.id,
                                                                           student.id,
                                                                           session) for task in
                              tasks]
            tasks_dto += [
                TaskStudentDataForTeacher(**{"task_id": task.id,
                                             "task_name": task.name} | (
                                                {"best_score": solution.score,
                                                 "status": solution.status} if solution else
                                                {"best_score": 0,
                                                 "status": SolutionStatus.NOT_SENT}))
                for task, solution in zip(tasks, best_solutions)]
        students_dto.append(StudentTaskDataForTeacher(student=UserDto.from_orm(student),
                                                      tasks=tasks_dto))
    return TableDataForTeacher(lessons=lessons_dto, students=students_dto)


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


@router.get("/get_lesson_stat_for_student", response_model=LessonStat)
async def get_lessons_stat_for_student(group_id: int,
                                       course_id: int,
                                       lesson_id: int,
                                       current_user: User = Depends(get_current_active_user),
                                       session=Depends(get_session)) -> LessonStat:
    # check group access
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    if not user_group or user_group.role != UserGroupRole.STUDENT:
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

    course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
    if not course_lesson:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to lesson")
    lesson = await LessonService.get_lesson(lesson_id, session)
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
    return lesson_dto


@router.get("/get_rating_for_teacher", response_model=RatingGroupForTeacher)
async def get_rating_for_teacher(group_id: int,
                                 course_id: int,
                                 current_user: User = Depends(get_current_active_user),
                                 session=Depends(get_session)):
    user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                         group_id,
                                                         session)
    if user_group.role == UserGroupRole.STUDENT or not user_group:
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

    lessons = await LessonService.get_lessons_by_course_id(course_id, session)
    users = await UserService.get_students_by_group_id(group_id, session)
    rating_group_for_teacher: List[RatingStudentForTeacher] = [
        RatingStudentForTeacher(user_id=user.id,
                                user_first_name=user.first_name,
                                user_last_name=user.last_name) for user in users]
    max_score_of_course = 0
    for lesson in lessons:
        tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
        lesson_score = sum(map(lambda task: task.max_score, tasks))
        max_score_of_course += lesson_score

        for rating in rating_group_for_teacher:
            for task in tasks:
                user_solution = await SolutionService.get_best_user_solution(group_id,
                                                                             course_id,
                                                                             task.id,
                                                                             rating.user_id,
                                                                             session)
                rating.current_score += user_solution.score

    for rating in rating_group_for_teacher:
        rating.max_score = max_score_of_course
        rating.current_score_procent = rating.current_score / rating.max_score * 100

    return RatingGroupForTeacher(ratings=rating_group_for_teacher)
