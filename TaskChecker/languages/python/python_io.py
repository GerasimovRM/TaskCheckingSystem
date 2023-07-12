import logging
from datetime import datetime
from typing import List, Optional

import epicbox

from epicbox_additional import EpicboxLimits, EpicboxFile
from epicbox_additional.epicbox_files import EpicboxFiles
from languages.python.python_common import PythonCommon
from models.solution import SolutionStatus, SolutionDto
from services import TaskTestService, SolutionService


class PythonIO(PythonCommon):
    def __init__(self,
                 solution: SolutionDto,
                 files: Optional[EpicboxFiles] = None,
                 limits: Optional[EpicboxLimits] = None):
        if not files:
            files = EpicboxFiles([EpicboxFile("main.py", solution.code)])
        else:
            files = files
        super().__init__(solution, files, limits)

    def run_tests(self, *args, **kwargs):
        if self.check_pep8 and self.is_pep_8():
            pass
        else:
            return False
        tests = TaskTestService.get_by_task_id(self.solution.task_id)
        self.solution.check_system_answer = ""
        if tests:
            for i, test in enumerate(tests, 1):
                input_data = test.input_data.replace("\r", "") if test.input_data else "\n"
                # print(self.limits.get_limtis())
                # print(self.files.get_files())
                test_result = epicbox.run('python', 'python3 main.py',
                                          files=self.files.get_files(),
                                          limits=self.limits.get_limtis(),
                                          stdin=input_data)
                logging.info(test_result)
                # logging.info(">>", test.input_data, *map(ord, test.input_data))
                # print(repr(test_result["stdout"].decode("utf-8").rstrip()), repr(test.output_data))

                if test_result["exit_code"] == 0:
                    test_answer = "\n".join(map(str.rstrip,
                                                test_result["stdout"].decode(
                                                    "utf-8").rstrip().replace(
                                                    "\r", "").split('\n'))).rstrip()
                    accept_answer = "\n".join(map(str.rstrip,
                                                  (
                                                      test.output_data if test.output_data else "").split(
                                                      "\n"))).replace("\r", "").rstrip()
                    logging.info(test_answer)
                    logging.info(accept_answer)
                    logging.info([ord(c) for c in test_answer])
                    logging.info([ord(c) for c in accept_answer])
                    logging.info(test_answer == accept_answer)
                    # TODO: answer
                    if test_answer != accept_answer:
                        self.solution.input_data = input_data
                        self.solution.except_answer = accept_answer
                        self.solution.user_answer = test_answer
                        self.solution.check_system_answer += f'Wrong answer!\nTest № {i}:\n'
                        self.solution.status = SolutionStatus.ERROR
                        self.solution.time_finish = datetime.now()
                        SolutionService.update(self.solution)
                        return False
                elif test_result["exit_code"] == 1:
                    self.solution.input_data = input_data
                    self.solution.check_system_answer += f"Test № {i}\n{test_result['stderr'].decode('utf-8')}"
                    self.solution.status = SolutionStatus.ERROR
                    self.solution.time_finish = datetime.now()
                    SolutionService.update(self.solution)
                    return False

            self.solution.score = self.solution.max_score
            self.solution.status = SolutionStatus.COMPLETE
            self.solution.time_finish = datetime.now()
            self.solution.check_system_answer += "All test are accepted!"
        else:
            self.solution.check_system_answer += "This task dont have tests!"
        SolutionService.update(self.solution)
        return True
