from typing import List, Optional

from models import LessonDto
from pydantic import BaseModel


class GroupCourseResponse(BaseModel):
    lessons: List[LessonDto]
    course_name: str
    course_description: Optional[str]
