from typing import Optional
from pydantic import BaseModel
from database import Course


class TaskDto(BaseModel):
    id: int
    name: str
    description: str
    grade: int
    status: int
