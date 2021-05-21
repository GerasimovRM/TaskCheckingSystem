import ormar

from .base_meta import BaseMeta


class LessonsTasks(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_lessons_tasks"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
