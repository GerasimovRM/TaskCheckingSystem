import ormar
from .database_settings import DATABASE_URL
import databases
import sqlalchemy


database = databases.Database(DATABASE_URL)
metadata = sqlalchemy.MetaData()


class BaseMeta(ormar.ModelMeta):
    metadata = metadata
    database = database
