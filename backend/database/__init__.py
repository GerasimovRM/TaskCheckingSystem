import sqlalchemy

from .database_settings import DATABASE_URL
from .base_meta import metadata, BaseMeta
import ormar

from typing import Optional, List


from .user import User
from .lesson import Lesson
from .course import Course


engine = sqlalchemy.create_engine(DATABASE_URL)

metadata.drop_all(engine)
metadata.create_all(engine)
