from typing import Optional

from pydantic import BaseModel


class TaskTestDto(BaseModel):
    id: int
    queue: int
    input_data: Optional[str]
    output_data: Optional[str]
    unit_test_code: Optional[str]
    task_id: int
