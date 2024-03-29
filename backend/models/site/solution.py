from pydantic import BaseModel, StrictInt

from models.pydantic_sqlalchemy_core import SolutionDto


class SolutionResponse(SolutionDto):
    pass


class SolutionForTaskChecker(SolutionDto):
    max_score: int


class SolutionCheckerResponse(SolutionDto):
    max_score: int


class SolutionsCountResponse(BaseModel):
    solutions_count: int
    solutions_complete_count: int
    solutions_complete_not_max_count: int
    solutions_complete_error_count: int
    solutions_complete_on_review_count: int
    solutions_undefined_count: int
