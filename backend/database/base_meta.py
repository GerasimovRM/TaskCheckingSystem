import ormar
from config import DATABASE_URL, SQL_ECHO
import databases
import sqlalchemy

metadata = sqlalchemy.MetaData()
database = databases.Database(str(DATABASE_URL))
engine = sqlalchemy.create_engine(str(DATABASE_URL), echo=SQL_ECHO)


class BaseMeta(ormar.ModelMeta):
    metadata = metadata
    database = database
