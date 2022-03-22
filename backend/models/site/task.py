from typing import List, Optional

from pydantic import BaseModel

from models import TaskDto


class TasksResponse(BaseModel):
    tasks: List[TaskDto]


class TaskResponse(TaskDto):
    pass
