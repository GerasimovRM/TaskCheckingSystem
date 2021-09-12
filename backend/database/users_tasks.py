from enum import IntEnum

import ormar

from .base_meta import BaseMeta


class UsersTasks(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_tasks"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)