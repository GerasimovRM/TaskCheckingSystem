from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy_utils import database_exists, create_database
from sqlalchemy import update as sqlalchemy_update

from config import DATABASE_URL, SQL_ECHO
import database
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

engine = None #create_async_engine(DATABASE_URL, future=True, echo=True)
async_session = None #sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()
metadata = Base.metadata



