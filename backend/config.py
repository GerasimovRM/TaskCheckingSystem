from pathlib import Path
import os
from dotenv import load_dotenv

if not os.getenv("DOCKER"):
    # print(Path(__file__).parent.joinpath('..', '.env').resolve())
    load_dotenv(Path(__file__).parent.joinpath('..', '.env').resolve())
    KAFKA_URL = f"localhost:{os.getenv('KAFKA_PORT')}"
else:
    KAFKA_URL = f"kafka:9092"

TASK_CHECKER_TOPIC_NAME = os.getenv("TASK_CHECKER_TOPIC_NAME")

VK_CLIENT_ID = os.getenv("VK_CLIENT_ID")
VK_CLIENT_SECRET = os.getenv("VK_CLIENT_SECRET")
VK_REDIRECT_URI = os.getenv("VK_REDIRECT_URI")

SECRET_KEY = os.getenv("SECRET_KEY")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
SQL_ECHO = os.getenv("SQL_ECHO") in ("True", "true", "1")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_NAME = os.getenv("DATABASE_NAME")
DATABASE_BASE_URL = f"{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}"
DATABASE_URL = f"postgresql+asyncpg://{DATABASE_BASE_URL}"
DATABASE_URL_SYNC = f"postgresql+psycopg2://{DATABASE_BASE_URL}"
