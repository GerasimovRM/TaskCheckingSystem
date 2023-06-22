from enum import IntEnum
from typing import Optional

from pydantic import BaseModel, StrictStr
from datetime import datetime


class SolutionDto(BaseModel):
    id: int
    task_id: int
    user_id: int
    course_id: int
    group_id: int
    score: int
    code: StrictStr
    status: StrictStr
    time_start: datetime
    time_finish: Optional[datetime]
    check_system_answer: Optional[StrictStr]
    test_type: Optional[StrictStr]
    input_data: Optional[StrictStr]
    except_answer: Optional[StrictStr]
    user_answer: Optional[StrictStr]
    unit_test_code: Optional[StrictStr]
    max_score: int


class SolutionStatus(IntEnum):
    NOT_SENT: int = -2
    ERROR: int = -1
    ON_REVIEW: int = 0
    COMPLETE_NOT_MAX: int = 1
    COMPLETE: int = 2
