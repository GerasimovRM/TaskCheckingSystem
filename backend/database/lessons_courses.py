import ormar

from .base_meta import BaseMeta


class LessonsCourses(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_lessons_courses"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
