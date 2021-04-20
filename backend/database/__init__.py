import sqlalchemy

from config import DATABASE_URL
from config import DATABASE_URL
from .base_meta import metadata, BaseMeta, database


from .user import User
from .lesson import Lesson
from .course import Course
from .task import Task


engine = sqlalchemy.create_engine(str(DATABASE_URL))

# metadata.drop_all(engine)
# metadata.create_all(engine)

