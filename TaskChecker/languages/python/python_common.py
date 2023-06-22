import io
import tempfile
from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Optional

import pycodestyle

from epicbox_additional import EpicboxFile, EpicboxLimits
from languages.multilanguage.multilanguage import Multilanguage
from models import SolutionDto
from contextlib import redirect_stdout

from models.solution import SolutionStatus
from services import SolutionService


class PythonCommon(Multilanguage, ABC):
    def __init__(self,
                 solution: SolutionDto,
                 files: Optional[List[EpicboxFile]],
                 limits: Optional[EpicboxLimits],
                 check_pep8: bool = True):
        super().__init__(solution, files, limits)
        self.check_pep8 = check_pep8

    def is_pep_8(self):
        # check pep8
        temp_file = tempfile.NamedTemporaryFile()
        with open(temp_file.name, "w") as tmp:
            solution_code = self.solution.code
            tmp.write(solution_code)

        pep8_checker = pycodestyle.Checker(temp_file.name, show_source=True)
        f = io.StringIO()
        with redirect_stdout(f):
            file_errors = pep8_checker.check_all()
        data = f.getvalue().splitlines()
        pep8_checker_out = list(map(lambda t: t.replace(temp_file.name, "solution.py"),
                                    filter(lambda x: x.startswith(temp_file.name), data)))
        pep8_checker_out_errors = list(
            filter(lambda t: t.split(": ")[-1].startswith("E"), pep8_checker_out))
        pep8_checker_out_others = list(
            filter(lambda t: t not in pep8_checker_out_errors, pep8_checker_out))

        if pep8_checker_out_errors:
            self.solution.check_system_answer += f"PEP8 Errors:\n" + '\n'.join(
                pep8_checker_out_errors) + "\n"
            self.solution.status = SolutionStatus.ERROR
            self.solution.time_finish = datetime.now()
            SolutionService.update(self.solution)
            return False
        return True
