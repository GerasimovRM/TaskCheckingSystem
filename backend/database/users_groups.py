from enum import IntEnum

import ormar

from .base_meta import BaseMeta


class UserGroupRole(IntEnum):
    OWNER: int = 1
    TEACHER: int = 2
    STUDENT: int = 3


class UsersGroups(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_groups"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    user_group_role: int = ormar.Integer(nullable=False, default=int(UserGroupRole.STUDENT))


print(UserGroupRole.STUDENT)
