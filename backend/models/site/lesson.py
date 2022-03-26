from typing import List

from pydantic import BaseModel

from models.pydantic_sqlalchemy_core import LessonDto


class LessonsResponse(BaseModel):
    lessons: List[LessonDto]


class LessonResponse(LessonDto):
    pass
