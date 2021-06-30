from typing import Optional, List
from pydantic import BaseModel

from models import CourseDto


class UserGroupDto(BaseModel):
    id: int
    name: Optional[str]
    role: Optional[int]
    courses: Optional[List[CourseDto]]

