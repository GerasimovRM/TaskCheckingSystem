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


class TaskUserTableDataForTeacher(BaseModel):
    task_name: str
    best_solution_score: int
    best_solution_status: SolutionStatus


class LessonUserTableDataForTeacher(BaseModel):
    lesson_name: str
    tasks: List[TaskUserTableDataForTeacher]
    lesson_date: datetime.datetime


class UserTableDataForTeacher(BaseModel):
    first_name: str
    last_name: str
    middle_name: Optional[str]
    image_logo: str
    lessons: List[LessonUserTableDataForTeacher]


class ResponseTableForTeacher(BaseModel):
    users: List[UserTableDataForTeacher]




