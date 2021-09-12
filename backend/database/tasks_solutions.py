import ormar

from .base_meta import BaseMeta


class TasksSolution(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_tasks_solutions"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)

