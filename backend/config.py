
from pathlib import Path
import os
from dotenv import load_dotenv


if os.path.isfile(f"{Path(__file__).parent.resolve()}/.env"):
    load_dotenv(f"{Path(__file__).parent.resolve()}/.env")
VK_CLIENT_ID = os.getenv("VK_CLIENT_ID")
VK_CLIENT_SECRET = os.getenv("VK_CLIENT_SECRET")
VK_REDIRECT_URI = os.getenv("VK_REDIRECT_URI")

SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
SQL_ECHO = os.getenv("SQL_ECHO") in ("True", "true", "1")
DATABASE_URL = os.getenv("DATABASE_URL")
DATABASE_URL_SYNC = DATABASE_URL
DATABASE_URL = DATABASE_URL.replace("postgres", "postgresql+asyncpg", 1) + "?async_fallback=true"
DATABASE_URL_SYNC = DATABASE_URL_SYNC.replace("postgres", "postgresql+psycopg2", 1)
RABBITMQ_USER = os.getenv("RABBITMQ_USER")
RABBITMQ_PASSWORD = os.getenv("RABBITMQ_PASSWORD")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD")
