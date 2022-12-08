from time import sleep
import logging

from celery_worker.worker import check_solution, test_celery

result = check_solution.delay(89)
logging.debug(result.status)
sleep(5)
logging.debug(result.status)