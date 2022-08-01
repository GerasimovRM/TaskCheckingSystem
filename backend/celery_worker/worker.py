from time import sleep

from celery import current_task
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_sync_session, Solution
from database.solution import SolutionStatus
from .app import celery_app
import epicbox


@celery_app.task(acks_late=True)
def test_celery(word: str) -> str:
    for i in range(1, 11):
        sleep(1)
        current_task.update_state(state='PROGRESS',
                                  meta={'process_percent': i*10})
    return f"test task return {word}"


@celery_app.task(acks_late=True)
def check_solution(solution_id: int):
    current_task.update_state(state="PROGRESS")
    print(123)
    epicbox.configure(
        profiles=[
            epicbox.Profile('python', 'python:3.6.5-alpine')
        ]
    )
    session: Session = get_sync_session()
    solution: Solution = session.query(Solution).get(solution_id)
    files = [{'name': 'main.py', 'content': solution.code.encode()}]
    limits = {'cputime': 1, 'memory': 64}

    result = epicbox.run('python', 'python3 main.py', files=files, limits=limits)
    solution.status = SolutionStatus.COMPLETE
    session.commit()
    session.close()
    return {"status": True}
