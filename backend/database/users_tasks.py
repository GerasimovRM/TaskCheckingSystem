from enum import IntEnum

import ormar

from .base_meta import BaseMeta


class UserTaskStatus(IntEnum):
    NOT_SENDED: int = 0
    ERROR_SENDED: int = 1
    PARTICAL_SOLVED: int = 2
    SOLVED: int = 3


class UserTaskRole(IntEnum):
    OWNER: int = 1
    STUDENT: int = 2


class UsersTasks(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_tasks"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    grade: int = ormar.Integer(default=0)
    status: int = ormar.Integer(default=int(UserTaskStatus.NOT_SENDED))
    user_task_role: int = ormar.Integer(default=int(UserTaskRole.STUDENT))
