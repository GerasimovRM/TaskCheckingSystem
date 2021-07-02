import ormar

from .base_meta import BaseMeta


class CoursesGroups(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_courses_groups"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
