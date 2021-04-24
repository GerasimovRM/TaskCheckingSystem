from typing import Optional, List
import hashlib
import base64

import ormar

from .base_meta import BaseMeta
from .course import Course
from .owners_courses import OwnersCourses
from .students_courses import StudentsCourses


class UserStatus:
    ACTIVE = 1
    BLOCKED = 2
    UNDEFINED = -1


class User(ormar.Model):
    class Meta(BaseMeta):
        tablename = "user"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    first_name: str = ormar.String(max_length=30)
    last_name: str = ormar.String(max_length=30)
    middle_name: str = ormar.String(max_length=30, nullable=True)
    password: Optional[str] = ormar.String(max_length=1000, nullable=True)
    vk_id: str = ormar.String(max_length=20, nullable=True)
    status: int = ormar.Integer(default=UserStatus.UNDEFINED)
    access_token: str = ormar.String(max_length=200, nullable=True)
    jwt_token: str = ormar.String(max_length=200, nullable=True)
    avatar_url: str = ormar.String(max_length=200, nullable=True)
    owner_courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                             through=OwnersCourses,
                                                             through_relation_name="owner_id",
                                                             through_reverse_relation_name="course_id",
                                                             related_name="owners_courses")
    student_courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                               through=StudentsCourses,
                                                               through_relation_name="student_id",
                                                               through_reverse_relation_name="course_id",
                                                               related_name="students_courses")
