git pull
docker-compose up -d --build --scale celery-worker=4 --remove-orphans
