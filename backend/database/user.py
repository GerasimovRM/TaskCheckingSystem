from typing import Optional, List
from enum import IntEnum

from pydantic import BaseModel

import ormar

from .base_meta import BaseMeta
from .group import Group
from .users_groups import UsersGroups
from .users_tasks import UsersTasks
from .task import Task


class UserStatus(IntEnum):
    ACTIVE: int = 1
    BLOCKED: int = 2
    UNDEFINED: int = -1


class User(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_user"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    first_name: str = ormar.String(max_length=30)
    last_name: str = ormar.String(max_length=30)
    middle_name: str = ormar.String(max_length=30, nullable=True)
    password: Optional[str] = ormar.String(max_length=1000, nullable=True)
    vk_id: str = ormar.String(max_length=20, nullable=True)
    status: int = ormar.Integer(default=UserStatus.UNDEFINED)
    vk_access_token: str = ormar.String(max_length=200, nullable=True)
    avatar_url: str = ormar.String(max_length=200, nullable=True)

    groups = ormar.ManyToMany(Group,
                              through=UsersGroups,
                              through_relation_name="user",
                              through_reverse_relation_name="group")
    tasks = ormar.ManyToMany(Task,
                             through=UsersTasks,
                             through_relation_name="user",
                             through_reverse_relation_name="task")

    """
    courses = ormar.ManyToMany(Course,
                               through=UsersCourses,
                               through_relation_name="user",
                               through_reverse_relation_name="course")
    tasks = ormar.ManyToMany(Task,
                             through=UsersTasks,
                             through_relation_name="user",
                             through_reverse_relation_name="task")
     """

