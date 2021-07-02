import ormar

from .base_meta import BaseMeta
from .user import User
from .task import Task


class UsersTasks(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_tasks"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    score: float = ormar.Float(default=0.0, nullable=False)
    user: User = ormar.ForeignKey(User, related_name="users_tasks", ondelete="CASCADE")
    task: Task = ormar.ForeignKey(Task, related_name="users_tasks", ondelete="CASCADE")
