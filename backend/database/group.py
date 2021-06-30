from typing import Optional, List
from enum import IntEnum

from pydantic import BaseModel

import ormar

from .base_meta import BaseMeta
from .courses_groups import CoursesGroups
from .course import Course


class UserGroupRole(IntEnum):
    OWNER: int = 1  # OWNER is TEACHER too, but he can delete course
    TEACHER: int = 2
    STUDENT: int = 3


class Group(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_group"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    name: str = ormar.String(max_length=100, nullable=True)
    courses = ormar.ManyToMany(Course,
                               through=CoursesGroups,
                               through_relation_name="group",
                               through_reverse_relation_name="course")
