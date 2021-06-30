import ormar

from .base_meta import BaseMeta
from .user import User
from .course import Course
from .task import Task


class UsersCoursesTasks(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_users_courses_tasks"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    score: float = ormar.Float(default=0.0, nullable=False)
    user: User = ormar.ForeignKey(User, related_name="users_courses_tasks")
    course: Course = ormar.ForeignKey(Course, related_name="users_courses_tasks")
    task: Task = ormar.ForeignKey(Task, related_name="users_courses_tasks")
