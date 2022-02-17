from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database import User, Group, Course, Lesson, Task

CourseDto = sqlalchemy_to_pydantic(Course)
LessonDto = sqlalchemy_to_pydantic(Lesson)
TaskDto = sqlalchemy_to_pydantic(Task)
GroupDto = sqlalchemy_to_pydantic(Group)
UserDto = sqlalchemy_to_pydantic(User)
UserDto.__fields__.pop("password")


class UserGroupDto(GroupDto):
    role: int
