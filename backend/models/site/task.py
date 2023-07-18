from typing import List, Optional

from pydantic import BaseModel

from models.pydantic_sqlalchemy_core import TaskDto, SolutionDto
from services.common import exclude_field, exclude_fields


class TasksResponse(BaseModel):
    tasks: List[TaskDto]


class TaskResponse(TaskDto):
    pass


class TaskCountForStudentResponse(BaseModel):
    tasks_count: int
    tasks_complete_count: int
    tasks_complete_not_max_count: int
    tasks_complete_error_count: int
    tasks_complete_on_review_count: int
    tasks_undefined_count: int


class TaskCountForTeacherResponse(BaseModel):
    students_count: int
    students_with_all_completed_tasks: int


class TaskSolution(BaseModel):
    task: TaskDto
    solution: SolutionDto


@exclude_fields(["id", "task_type"])
class TaskPostRequest(TaskDto):
    pass


class TasksPostRequest(BaseModel):
    tasks: List[TaskPostRequest]

    class Config:
        orm_mode = True