from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database import User, Group, Course, Lesson, Task, Solution
from database.solution import SolutionStatus

CourseDto = sqlalchemy_to_pydantic(Course)
LessonDto = sqlalchemy_to_pydantic(Lesson)
BaseTaskDto = sqlalchemy_to_pydantic(Task)
print(BaseTaskDto.__fields__)
GroupDto = sqlalchemy_to_pydantic(Group)
UserDto = sqlalchemy_to_pydantic(User)
SolutionDto = sqlalchemy_to_pydantic(Solution)
print(SolutionDto.__fields__)
UserDto.__fields__.pop("password")


class UserGroupDto(GroupDto):
    role: str


class TaskDto(BaseTaskDto):
    score: Optional[int]
    status: Optional[SolutionStatus]
    attachments: Optional[list]
    solution: Optional[SolutionDto]
