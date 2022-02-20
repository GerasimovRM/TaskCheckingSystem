from databases import DatabaseURL
from starlette.config import Config
from pathlib import Path
import os


config = Config(os.path.join(os.path.split(os.path.abspath(__file__))[0], ".env"))

VK_CLIENT_ID = config("VK_CLIENT_ID", cast=str)
VK_CLIENT_SECRET = config("VK_CLIENT_SECRET", cast=str)
VK_REDIRECT_URI = config("VK_REDIRECT_URI", cast=str)

SECRET_KEY = config("SECRET_KEY", cast=str)
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)
JWT_ALGORITHM = config("JWT_ALGORITHM", cast=str)

POSTGRES_USER = config("POSTGRES_USER", cast=str)
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD", cast=str)
POSTGRES_SERVER = config("POSTGRES_SERVER", cast=str)
POSTGRES_PORT = config("POSTGRES_PORT", cast=int)
POSTGRES_DB = config("POSTGRES_DB", cast=str)

SQL_ECHO = config("SQL_ECHO", cast=bool)
DATABASE_URL = config(
    "DATABASE_URL",
    cast=str,
    default=f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}?async_fallback=true",
)

SERVER_HOST = config("SERVER_HOST", cast=str)
SERVER_PORT = config("SERVER_PORT", cast=int)