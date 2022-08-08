import os

from celery import Celery

from config import RABBITMQ_USER, RABBITMQ_PASSWORD, REDIS_PASSWORD

celery_app = None

if not os.getenv("DOCKER"):
    celery_app = Celery(
        "worker",
        broker=f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@localhost:5672//",
        backend=f"redis://:{REDIS_PASSWORD}@localhost:6379/0"
    )
else:
    celery_app = Celery(
        "worker",
        broker=f"amqp://{RABBITMQ_USER}:{RABBITMQ_PASSWORD}@rabbitmq:5672//",
        backend=f"redis://:{REDIS_PASSWORD}@redis:6379/0"
    )
celery_app.conf.task_routes = {
    "celery_worker.worker.test_celery": "check-solution-queue",
    "celery_worker.worker.check_solution": "check-solution-queue"
}
celery_app.conf.update(task_track_started=True)

