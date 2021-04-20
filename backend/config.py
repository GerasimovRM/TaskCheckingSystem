from databases import DatabaseURL
from starlette.config import Config

config = Config(".env")

PROJECT_NAME = "TaskCheckingSystem"
VERSION = "1.0.0"
API_PREFIX = "/api"

SECRET_KEY = config("SECRET_KEY", cast=str)
ACCESS_TOKEN_EXPIRE_MINUTES = config("ACCESS_TOKEN_EXPIRE_MINUTES", cast=int)
JWT_ALGORITHM = config("JWT_ALGORITHM", cast=str)

POSTGRES_USER = config("POSTGRES_USER", cast=str)
POSTGRES_PASSWORD = config("POSTGRES_PASSWORD", cast=str)
POSTGRES_SERVER = config("POSTGRES_SERVER", cast=str)
POSTGRES_PORT = config("POSTGRES_PORT", cast=int)
POSTGRES_DB = config("POSTGRES_DB", cast=str)

DATABASE_URL = config(
    "DATABASE_URL",
    cast=DatabaseURL,
    default=f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_SERVER}:{POSTGRES_PORT}/{POSTGRES_DB}",
)
