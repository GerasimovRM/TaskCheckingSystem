import ormar

from .base_meta import BaseMeta
from .users_tasks import UsersTasks


class Solution(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_solution"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    user_task: UsersTasks = ormar.ForeignKey(UsersTasks,
                                             related_name="solutions",
                                             ondelete="CASCADE")
