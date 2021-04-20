from typing import List, Optional

import ormar
from .base_meta import BaseMeta
from .course import Course


class Lesson(ormar.Model):
    class Meta(BaseMeta):
        tablename = "lesson"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=100)
    description: str = ormar.String(max_length=3000)
    courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                       through_relation_name="lesson_id",
                                                       through_reverse_relation_name="course_id")
