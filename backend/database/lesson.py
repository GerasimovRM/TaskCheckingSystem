from typing import List, Optional

import ormar
from .base_meta import BaseMeta
from .course import Course
from .lessons_courses import LessonsCourses


class Lesson(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_lesson"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    name: str = ormar.String(max_length=100)
    description: str = ormar.String(max_length=3000)
    courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                       through=LessonsCourses,
                                                       through_relation_name="lesson",
                                                       through_reverse_relation_name="course"
                                                       )
