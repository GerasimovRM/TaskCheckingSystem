from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database import User, Group, Course, Lesson, Task, Solution

CourseDto = sqlalchemy_to_pydantic(Course)
LessonDto = sqlalchemy_to_pydantic(Lesson)
TasksDto = sqlalchemy_to_pydantic(Task)
GroupDto = sqlalchemy_to_pydantic(Group)
UserDto = sqlalchemy_to_pydantic(User)
SolutionDto = sqlalchemy_to_pydantic(Solution)
UserDto.__fields__.pop("password")


class UserGroupDto(GroupDto):
    role: str


class TaskDto(TasksDto):
    score: Optional[int]
    attachments: Optional[list]
    solution: Optional[SolutionDto]