from typing import List, Optional

import ormar

from .base_meta import BaseMeta
from .lesson import Lesson
from .lessons_tasks import LessonsTasks


class Task(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_task"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=100)
    description: str = ormar.String(max_length=3000)
    max_score: float = ormar.Float(default=0.0, nullable=False)
    lessons: Optional[List[Lesson]] = ormar.ManyToMany(Lesson,
                                                       through=LessonsTasks,
                                                       through_relation_name="task",
                                                       through_reverse_relation_name="lesson")
