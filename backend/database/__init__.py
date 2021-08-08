import sqlalchemy

from config import DATABASE_URL
from .base_meta import metadata, BaseMeta, database, engine


from .user import User
from .lesson import Lesson
from .course import Course
from .task import Task
from .lessons_tasks import LessonsTasks
from .lessons_courses import LessonsCourses
from .admin import Admin
from .refresh_token import RefreshToken
from .group import Group
from .users_groups import UsersGroups
from .courses_groups import CoursesGroups
from .users_courses_tasks import UsersCoursesTasks
from .solution import Solution
from .teacher import Teacher

# metadata.drop_all(engine)
# metadata.create_all(engine)

