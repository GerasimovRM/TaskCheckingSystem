import os
from pathlib import Path

from common import MetaSingleton
from dotenv import load_dotenv


class ConfigLoader(metaclass=MetaSingleton):
    def __init__(self):
        if not os.getenv("DOCKER"):
            load_dotenv(Path(__file__).parent.joinpath('..', '.env').resolve())
            self.BACKEND_URL = f"http://localhost:{os.getenv('BACKEND_PORT')}"
        else:
            self.BACKEND_URL = f"http://backend:8000"
        self.TASK_CHECKER_USERNAME = os.getenv("TASK_CHECKER_USERNAME")
        self.TASK_CHECKER_PASSWORD = os.getenv("TASK_CHECKER_PASSWORD")


if __name__ == '__main__':
    pass
