import os

from celery import Celery

from config import RABBITMQ_USER, RABBITMQ_PASSWORD

celery_app = None

if not os.getenv("DOCKER"):
    celery_app = Celery(
        "worker",
         broker=f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@localhost:5672//"

    )