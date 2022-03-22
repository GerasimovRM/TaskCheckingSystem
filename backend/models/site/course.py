from typing import List

from pydantic import BaseModel

from models import CourseDto


class CoursesResponse(BaseModel):
    courses: List[CourseDto]


class CourseResponse(CourseDto):
    pass
