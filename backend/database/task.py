from typing import List, Optional

import ormar

from .base_meta import BaseMeta
from .lesson import Lesson


class Task(ormar.Model):
    class Meta(BaseMeta):
        tablename = "task"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=100)
    description: str = ormar.String(max_length=3000)
    lessons: Optional[List[Lesson]] = ormar.ManyToMany(Lesson,
                                                       through_relation_name="task_id",
                                                       through_reverse_relation_name="lesson_id"
                                                       )
