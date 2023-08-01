from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.solution import SolutionStatus
from models.pydantic_sqlalchemy_core import UserDto
from models.site.stat import CourseStatForStudent, TaskStat, LessonStat, \
    TableDataForTeacher, LessonDataForTeacher, TaskLessonDataForTeacher, TaskStudentDataForTeacher, \
    StudentTaskDataForTeacher, RatingGroupForTeacher, RatingStudentForTeacher
from services.auth_service import get_current_active_user, get_teacher
from database import User, get_session, Course, CoursesLessons, Lesson
from services.solution_service import SolutionService
from services.task_service import TaskService
from api.deps import get_user_group, get_group_course, get_lessons_by_course_id, get_course, \
    get_course_lessons, get_course_lesson, get_lesson, get_students_by_group_id


router = APIRouter(
    prefix="/stat",
    tags=["stat"]
)


@router.get("/get_table_for_teacher", response_model=TableDataForTeacher, dependencies=[
    Depends(get_teacher),
    Depends(get_user_group),
    Depends(get_group_course)
])
async def get_table_for_teacher(group_id: int,
                                course_id: int,
                                lessons: list[Lesson] = Depends(get_lessons_by_course_id),
                                students: list[User] = Depends(get_students_by_group_id),
                                session: AsyncSession = Depends(get_session)) -> TableDataForTeacher:
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

    students_dto: List[StudentTaskDataForTeacher] = []
    # TODO: need to optimize
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


@router.get("/get_course_stat_for_student", response_model=CourseStatForStudent, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course)
])
async def get_course_stat_for_student(group_id: int,
                                      course_id: int,
                                      course: Course = Depends(get_course),
                                      course_lessons: CoursesLessons = Depends(get_course_lessons),
                                      current_user: User = Depends(get_current_active_user),
                                      session: AsyncSession = Depends(get_session)) -> CourseStatForStudent:
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


@router.get("/get_lesson_stat_for_student", response_model=LessonStat, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course),
    Depends(get_course_lesson)
])
async def get_lessons_stat_for_student(group_id: int,
                                       course_id: int,
                                       lesson: Lesson = Depends(get_lesson),
                                       current_user: User = Depends(get_current_active_user),
                                       session: AsyncSession = Depends(get_session)) -> LessonStat:
    tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)  # TODO: куда его такого
    best_solutions = [await SolutionService.get_best_user_solution(group_id,  # а этого
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


@router.get("/get_rating_for_teacher", response_model=RatingGroupForTeacher, dependencies=[
    Depends(get_user_group),
    Depends(get_group_course)
])
async def get_rating_for_teacher(group_id: int,
                                 course_id: int,
                                 lessons: list[Lesson] = Depends(get_lessons_by_course_id),
                                 users: list[User] = Depends(get_students_by_group_id),
                                 session: AsyncSession = Depends(get_session)):
    rating_group_for_teacher: List[RatingStudentForTeacher] = [
        RatingStudentForTeacher(user_id=user.id,
                                user_first_name=user.first_name,
                                user_last_name=user.last_name) for user in users
    ]
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
                if user_solution:
                    rating.current_score += user_solution.score

    for rating in rating_group_for_teacher:
        rating.max_score = max_score_of_course
        rating.current_score_procent = rating.current_score / rating.max_score * 100

    return RatingGroupForTeacher(ratings=rating_group_for_teacher)
