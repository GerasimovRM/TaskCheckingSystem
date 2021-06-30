import sqlalchemy

from config import DATABASE_URL
from .base_meta import metadata, BaseMeta, database, engine


from .user import User
from .lesson import Lesson
from .course import Course
from .task import Task
from .users_courses import UsersCourses
from .lessons_tasks import LessonsTasks
from .lessons_courses import LessonsCourses
from .users_tasks import UsersTasks
from .admin import Admin
from .refresh_token import RefreshToken
from .teacher import Teacher

# metadata.drop_all(engine)
# metadata.create_all(engine)

