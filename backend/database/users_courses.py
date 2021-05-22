from typing import List, Optional
from enum import IntEnum

from pydantic import BaseModel, Field

import ormar

from .base_meta import BaseMeta


class UserCourseRole(IntEnum):
    OWNER: int = 1  # OWNER is TEACHER too, but he can delete course
    TEACHER: int = 2
    STUDENT: int = 3


class UsersCourses(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_courses"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    user_course_role: int = ormar.Integer(default=int(UserCourseRole.STUDENT))
