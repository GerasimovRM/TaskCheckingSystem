import ormar

from .base_meta import BaseMeta
from .users_courses_tasks import UsersCoursesTasks


class Solution(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_solution"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    user_course_task: UsersCoursesTasks = ormar.ForeignKey(UsersCoursesTasks,
                                                           related_name="solutions")
