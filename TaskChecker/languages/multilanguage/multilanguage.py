from abc import ABC, abstractmethod
from typing import List, Optional

from epicbox_additional import EpicboxFile, EpicboxLimits
from epicbox_additional.epicbox_files import EpicboxFiles
from models import SolutionDto


class Multilanguage(ABC):
    def __init__(self, solution: SolutionDto,
                 files: Optional[EpicboxFiles] = None,
                 limits: Optional[EpicboxLimits] = None):
        self.solution: SolutionDto = solution.copy()

        if not files:
            self.files = EpicboxFiles([EpicboxFile("main.py", solution.code)])
        else:
            self.files = files

        self.limits = limits if limits else EpicboxLimits()

    @abstractmethod
    def run_tests(self, *args, **kwargs):
        pass
