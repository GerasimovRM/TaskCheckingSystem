import datetime
import io
import logging
from contextlib import redirect_stdout
from time import sleep
from typing import List

import docker
import pycodestyle
from celery import current_task
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_sync_session, Solution, TaskTest
from database.solution import SolutionStatus, TestType
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


def python_io_run(solution: Solution, session: Session):
    # check tests from db
    tests: List[TaskTest] = session.query(TaskTest) \
        .where(TaskTest.task_id == solution.task_id) \
        .order_by(TaskTest.queue) \
        .all()
    files = [{'name': 'main.py', 'content': solution.code.encode()}]
    limits = {'cputime': 10, 'memory': 10}
    if tests:
        for i, test in enumerate(tests, 1):
            input_data = test.input_data.replace("\r", "") if test.input_data else "\n"
            test_result = epicbox.run('python', 'python3 main.py',
                                      files=files,
                                      limits=limits,
                                      stdin=input_data)
            logging.info(test_result)
            # logging.info(">>", test.input_data, *map(ord, test.input_data))
            # print(repr(test_result["stdout"].decode("utf-8").rstrip()), repr(test.output_data))
            if test_result["exit_code"] == 0:
                test_answer = "\n".join(map(str.rstrip,
                                            test_result["stdout"].decode("utf-8").rstrip().replace(
                                                "\r", "").split('\n'))).rstrip()
                accept_answer = "\n".join(map(str.rstrip,
                                              (test.output_data if test.output_data else "").split(
                                                  "\n"))).replace("\r", "").rstrip()
                logging.info(test_answer)
                logging.info(accept_answer)
                logging.info([ord(c) for c in test_answer])
                logging.info([ord(c) for c in accept_answer])
                logging.info(test_answer == accept_answer)
                if test_answer != accept_answer:
                    solution.input_data = input_data
                    solution.except_answer = accept_answer
                    solution.user_answer = test_answer
                    solution.check_system_answer += f'Wrong answer!\nTest № {i}:\n'
                    solution.status = SolutionStatus.ERROR
                    solution.time_finish = datetime.datetime.now()
                    session.commit()
                    session.close()
                    return {"status": False}
            elif test_result["exit_code"] == 1:
                solution.input_data = input_data
                solution.check_system_answer += f"Test № {i}\n{test_result['stderr'].decode('utf-8')}"
                solution.status = SolutionStatus.ERROR
                solution.time_finish = datetime.datetime.now()
                session.commit()
                session.close()
                return {"status": False}

        solution.score = solution.task.max_score
        solution.status = SolutionStatus.COMPLETE
        solution.time_finish = datetime.datetime.now()
        solution.check_system_answer += "All test are accepted!"
        session.commit()
        session.close()

    else:
        pass
        # TODO: dont run worker if no tests
    return {"status": True}


def python_ut_run(solution: Solution, session: Session):
    # check tests from db
    tests: List[TaskTest] = session.query(TaskTest) \
        .where(TaskTest.task_id == solution.task_id) \
        .order_by(TaskTest.queue) \
        .all()
    base_files = [{'name': 'solution.py', 'content': solution.code.encode()}]
    limits = {'cputime': 10, 'memory': 10}
    logging.info("Tests length:", len(tests))
    if tests:
        for i, test in enumerate(tests, 1):
            test: TaskTest
            files = base_files + [{'name': 'main.py', 'content': test.unit_test_code.encode()}]
            input_data = test.input_data.replace("\r", "") if test.input_data else "\n"
            test_result = epicbox.run('python', 'python3 main.py',
                                      files=files,
                                      limits=limits,
                                      stdin=input_data)
            logging.info(test_result)
            # logging.info(">>", test.input_data, *map(ord, test.input_data))
            # print(repr(test_result["stdout"].decode("utf-8").rstrip()), repr(test.output_data))
            if test_result["exit_code"] == 0:
                test_answer = "\n".join(map(str.rstrip,
                                            test_result["stdout"].decode("utf-8").rstrip().replace(
                                                "\r", "").split('\n'))).rstrip()
                accept_answer = "\n".join(map(str.rstrip,
                                              (test.output_data if test.output_data else "").split(
                                                  "\n"))).replace("\r", "").rstrip()
                logging.info(test_answer)
                logging.info(accept_answer)
                logging.info([ord(c) for c in test_answer])
                logging.info([ord(c) for c in accept_answer])
                logging.info(test_answer == accept_answer)
                if test_answer != accept_answer:
                    solution.input_data = input_data
                    solution.unit_test_code = test.unit_test_code
                    solution.except_answer = accept_answer
                    solution.user_answer = test_answer
                    solution.check_system_answer += f'Wrong answer!\nTest № {i}:\n'
                    solution.status = SolutionStatus.ERROR
                    solution.time_finish = datetime.datetime.now()
                    session.commit()
                    session.close()
                    return {"status": False}
            elif test_result["exit_code"] == 1:
                solution.input_data = input_data
                solution.unit_test_code = test.unit_test_code
                solution.check_system_answer += f"Test № {i}\n{test_result['stderr'].decode('utf-8')}"
                solution.status = SolutionStatus.ERROR
                solution.time_finish = datetime.datetime.now()
                session.commit()
                session.close()
                return {"status": False}

        solution.score = solution.task.max_score
        solution.status = SolutionStatus.COMPLETE
        solution.time_finish = datetime.datetime.now()
        solution.check_system_answer += "All test are accepted!"
        session.commit()
        session.close()

    else:
        pass
        # TODO: dont run worker if no tests
    return {"status": True}


@celery_app.task(acks_late=True)
def check_solution(solution_id: int):
    current_task.update_state(state="PROGRESS")
    epicbox.configure(
        profiles=[
            epicbox.Profile('python', 'python:3.10.5-alpine')
        ]
    )
    session: Session = get_sync_session()
    solution: Solution = session.query(Solution).get(solution_id)
    # check pep8
    temp_file = tempfile.NamedTemporaryFile()
    with open(temp_file.name, "w") as tmp:
        solution_code = solution.code
        tmp.write(solution_code)

    pep8_checker = pycodestyle.Checker(temp_file.name, show_source=True)
    f = io.StringIO()
    with redirect_stdout(f):
        file_errors = pep8_checker.check_all()
    data = f.getvalue().splitlines()
    pep8_checker_out = list(map(lambda t: t.replace(temp_file.name, "solution.py"), filter(lambda x: x.startswith(temp_file.name), data)))
    pep8_checker_out_errors = list(filter(lambda t: t.split(": ")[-1].startswith("E"), pep8_checker_out))
    pep8_checker_out_others = list(filter(lambda t: t not in pep8_checker_out_errors, pep8_checker_out))
    solution.check_system_answer = ""
    # if pep8_checker_out_others:
    #     solution.check_system_answer += f"PEP8 Warnings:\n" + '\n'.join(pep8_checker_out_others) + "\n"
    if pep8_checker_out_errors:
        solution.check_system_answer += f"PEP8 Errors:\n" + '\n'.join(pep8_checker_out_errors) + "\n"
        solution.status = SolutionStatus.ERROR
        solution.time_finish = datetime.datetime.now()
        session.commit()
        return {"status": False}

    if solution.test_type == TestType.PYTHON_IO:
        return python_io_run(solution, session)
    elif solution.test_type == TestType.PYTHON_UT:
        return python_ut_run(solution, session)
    else:
        raise KeyError
