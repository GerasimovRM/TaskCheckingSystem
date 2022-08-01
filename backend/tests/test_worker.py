from time import sleep

from celery_worker.worker import check_solution, test_celery

result = check_solution.delay(3)
print(result.status)
sleep(5)
print(result.status)