from enum import IntEnum

import ormar

from .base_meta import BaseMeta


class UserCourseRole(IntEnum):
    OWNER: int = 1
    TEACHER: int = 2


class UsersCourses(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_courses"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    user_course_role: int = ormar.Integer(nullable=False)

