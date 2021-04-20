from typing import List, Optional

import ormar

from .base_meta import BaseMeta


class OwnersCourses(ormar.Model):
    class Meta(BaseMeta):
        tablename = "owners_courses"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
