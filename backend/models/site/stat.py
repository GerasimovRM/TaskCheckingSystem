import datetime
import pprint
from typing import List, Optional

from pydantic import BaseModel

from database.solution import SolutionStatus
from models.pydantic_sqlalchemy_core import TaskDto, LessonDto, CourseDto, UserDto
from services.common import exclude_fields, exclude_field


@exclude_fields(["description", "attachments"])
class TaskStat(TaskDto):
    best_score: int
    status: SolutionStatus


@exclude_field("description")
class LessonStat(LessonDto):
    tasks: List[TaskStat]


@exclude_field("description")
class CourseStatForStudent(CourseDto):
    lessons: List[LessonStat]


@exclude_fields(["avatar_url", "status", "vk_id"])
class UserStat(UserDto):
    lessons: List[LessonStat]


@exclude_field("description")
class CourseStatForTeacher(CourseDto):
    users: List[UserStat]


class TaskStudentDataForTeacher(BaseModel):
    task_id: int
    task_name: str
    best_score: int
    status: SolutionStatus


class TaskLessonDataForTeacher(BaseModel):
    task_id: int
    task_name: str
    max_score: int

    class Config:
        orm_mode = True


class LessonDataForTeacher(BaseModel):
    lesson_id: int
    lesson_name: str
    tasks: List[TaskLessonDataForTeacher]


class StudentTaskDataForTeacher(BaseModel):
    student: UserDto
    tasks: List[TaskStudentDataForTeacher]


class TableDataForTeacher(BaseModel):
    lessons: List[LessonDataForTeacher]
    students: List[StudentTaskDataForTeacher]


class RatingStudentForTeacher(BaseModel):
    user_id: int
    user_first_name: str
    user_last_name: str
    max_score: int = 0
    current_score: int = 0
    current_score_procent: float = 0


class RatingGroupForTeacher(BaseModel):
    ratings: List[RatingStudentForTeacher]
