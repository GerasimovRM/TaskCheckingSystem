from enum import IntEnum, Enum
from typing import Optional

from pydantic import BaseModel, StrictStr, StrictInt
from datetime import datetime


class TestType(str, Enum):
    PYTHON_IO = "PYTHON_IO"
    PYTHON_UT = "PYTHON_UT"


class SolutionDto(BaseModel):
    id: int
    task_id: int
    user_id: int
    course_id: int
    group_id: int
    score: int
    code: StrictStr
    status: StrictInt
    # time_start: datetime
    time_finish: Optional[datetime]
    check_system_answer: Optional[StrictStr]
    test_type: str
    input_data: Optional[StrictStr]
    except_answer: Optional[StrictStr]
    user_answer: Optional[StrictStr]
    unit_test_code: Optional[StrictStr]
    max_score: StrictInt


class SolutionStatus(IntEnum):
    NOT_SENT: int = -2
    ERROR: int = -1
    ON_REVIEW: int = 0
    COMPLETE_NOT_MAX: int = 1
    COMPLETE: int = 2
