from typing import Optional, List
from pydantic import BaseModel

from models import LessonDto, UserDto


class CourseBaseDto(BaseModel):
    id: int
    name: str
    description: Optional[str]


class CourseDto(CourseBaseDto):
    lessons: Optional[List[LessonDto]]


class UserInCourseDto(UserDto):
    user_course_role: Optional[int]


class CourseForTeacherOrAdminDto(CourseBaseDto):
    users: List[UserInCourseDto]