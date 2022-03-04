from typing import List

from models import CourseDto
from pydantic import BaseModel


class HomeResponse(BaseModel):
    courses: List[CourseDto]
