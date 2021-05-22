from typing import Optional
from pydantic import BaseModel
from database import Course


class LessonDto(BaseModel):
    id: int
    name: str
