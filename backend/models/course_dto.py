from typing import Optional, List
from pydantic import BaseModel

from models import LessonDto


class CourseDto(BaseModel):
    id: int
    name: str
    description: Optional[str]
    lessons: Optional[List[LessonDto]]
