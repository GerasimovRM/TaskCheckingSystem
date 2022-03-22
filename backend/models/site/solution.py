from pydantic import BaseModel

from models import SolutionDto


class SolutionResponse(SolutionDto):
    pass


class SolutionsCountResponse(BaseModel):
    solutions_count: int
    solutions_solved_count: int
