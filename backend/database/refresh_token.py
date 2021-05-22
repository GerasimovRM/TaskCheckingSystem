from typing import Optional, List
from enum import IntEnum
import ormar

from .base_meta import BaseMeta
from .user import User


class RefreshToken(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_refresh_token"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    token: str = ormar.String(max_length=200)
    user: User = ormar.ForeignKey(User, related_name="refresh_tokens")
