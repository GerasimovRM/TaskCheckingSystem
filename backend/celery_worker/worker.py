import datetime
import io
from contextlib import redirect_stdout
from time import sleep
from typing import List

import docker
# import pycodestyle
from celery import current_task
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_sync_session, Solution, TaskTest
from database.solution import SolutionStatus
from .app import celery_app
import epicbox
import tempfile


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
            epicbox.Profile('python', 'python:3.10.5-alpine')
        ]
    )
    session: Session = get_sync_session()
    solution: Solution = session.query(Solution).get(solution_id)
    tests: List[TaskTest] = session.query(TaskTest)\
        .where(TaskTest.task_id == solution.task_id)\
        .all()
    # check pep8
    # temp_file = tempfile.NamedTemporaryFile()
    # with open(temp_file.name, "w") as tmp:
    #     solution_code = solution.code
    #     tmp.write(solution_code)
    #
    # pep8_checker = pycodestyle.Checker(temp_file.name, show_source=True)
    # f = io.StringIO()
    # with redirect_stdout(f):
    #     file_errors = pep8_checker.check_all()
    # pep8_checker_out = list(map(lambda x: x.startswith(temp_file.name), f.getvalue().splitlines()))
    # if pep8_checker_out:
    #     solution.check_system_answer = f"PEP8 Errors:\n" + '\n'.join(pep8_checker_out)
    #     solution.status = SolutionStatus.ERROR
    #     solution.time_finish = datetime.datetime.now()
    #     session.commit()
    #     return {"status": False}

    # check tests from db
    files = [{'name': 'main.py', 'content': solution.code.encode()}]
    limits = {'cputime': 10, 'memory': 10}
    if tests:
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
    else:
        pass
        # TODO: dont run worker if no tests
    return {"status": True}
