import sqlalchemy

from config import DATABASE_URL
from .base_meta import metadata, BaseMeta, database, engine


from .user import User
from .lesson import Lesson
from .course import Course
from .task import Task


# metadata.drop_all(engine)
# metadata.create_all(engine)

