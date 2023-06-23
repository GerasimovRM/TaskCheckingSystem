import os
from pathlib import Path

from common import MetaSingleton
from dotenv import load_dotenv


class ConfigLoader(metaclass=MetaSingleton):
    def __init__(self):
        if not os.getenv("DOCKER"):
            load_dotenv(Path(__file__).parent.joinpath('..', '.env').resolve())
            self.BACKEND_URL = f"http://localhost:{os.getenv('BACKEND_PORT')}"
            self.KAFKA_URL = f"localhost:{os.getenv('KAFKA_PORT')}"
        else:
            self.BACKEND_URL = f"http://backend:8000"
            self.KAFKA_URL = f"kafka:9092"
        self.TASK_CHECKER_USERNAME = os.getenv("TASK_CHECKER_USERNAME")
        self.TASK_CHECKER_PASSWORD = os.getenv("TASK_CHECKER_PASSWORD")
        self.TASK_CHECKER_TOPIC_NAME = os.getenv("TASK_CHECKER_TOPIC_NAME")
        self.TASK_CHECKER_GROUP_NAME = os.getenv("TASK_CHECKER_GROUP_NAME")
        print(self.TASK_CHECKER_USERNAME, self.TASK_CHECKER_PASSWORD)

if __name__ == '__main__':
    pass
