from typing import List, Optional

import ormar

from .base_meta import BaseMeta


class Course(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_course"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=150)
    description: str = ormar.String(max_length=2000, nullable=True)
