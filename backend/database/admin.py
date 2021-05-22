from typing import Optional, List
from enum import IntEnum

from pydantic import BaseModel

import ormar

from .base_meta import BaseMeta
from .user import User


class Admin(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_admin"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    user: User = ormar.ForeignKey(User)

