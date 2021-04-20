from typing import List, Optional

import ormar

from .base_meta import BaseMeta


class StudentsCourses(ormar.Model):
    class Meta(BaseMeta):
        tablename = "students_courses"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
