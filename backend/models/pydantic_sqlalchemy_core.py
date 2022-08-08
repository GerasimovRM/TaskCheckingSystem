from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database import User, Group, Course, Lesson, Task, Solution, ChatMessage

CourseDto = sqlalchemy_to_pydantic(Course)
LessonDto = sqlalchemy_to_pydantic(Lesson)


class TaskDto(sqlalchemy_to_pydantic(Task)):
    attachments: Optional[list]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


GroupDto = sqlalchemy_to_pydantic(Group)
UserDto = sqlalchemy_to_pydantic(User)
SolutionDto = sqlalchemy_to_pydantic(Solution)
ChatMessageDto = sqlalchemy_to_pydantic(ChatMessage)

UserDto.__fields__.pop("password")
UserDto.__fields__.pop("vk_access_token")
