from typing import List, Optional

from pydantic import BaseModel

from models.pydantic_sqlalchemy_core import TaskDto
from services.common import exclude_field



class TasksResponse(BaseModel):
    tasks: List[TaskDto]


class TaskResponse(TaskDto):
    pass
