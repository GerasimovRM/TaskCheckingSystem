import datetime
from time import sleep
from typing import List

import docker
from celery import current_task
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_sync_session, Solution, TaskTest
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
    print(Solution)
    tests: List[TaskTest] = session.query(TaskTest)\
        .where(TaskTest.task_id == solution.task_id)\
        .all()
    files = [{'name': 'main.py', 'content': solution.code.encode()}]
    limits = {'cputime': 10, 'memory': 10}
    for i, test in enumerate(tests, 1):
        test_result = epicbox.run('python', 'python3 main.py',
                                  files=files,
                                  limits=limits,
                                  stdin=test.input_data)
        # print(repr(test_result["stdout"].decode("utf-8").strip()), repr(test.output_data))
        test_answer = test_result["stdout"].decode("utf-8").strip()
        if test_result["stdout"].decode("utf-8").strip() != test.output_data:
            test_result_text = test_result["stderr"].decode("utf-8")
            if not test_result_text:
                test_result_text = f"Wrong answer!\nExcept:\n{test.output_data}\n\nYour answer:\n{test_answer}"
            solution.check_system_answer = f'Test № {i}\n{test_result_text}'
            solution.status = SolutionStatus.ERROR
            solution.time_finish = datetime.datetime.now()
            session.commit()
            session.close()
            return {"status": False}

    solution.score = solution.task.max_score
    solution.status = SolutionStatus.COMPLETE
    solution.time_finish = datetime.datetime.now()
    session.commit()
    session.close()
    return {"status": True}
