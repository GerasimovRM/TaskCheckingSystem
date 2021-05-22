from typing import Optional, List
from pydantic import BaseModel

from models import UserDto, LessonDto


class CourseDto(BaseModel):
    id: int
    name: str
    description: Optional[str]
    students: Optional[List[UserDto]]
    teachers: Optional[List[UserDto]]
    lessons: Optional[List[LessonDto]]
