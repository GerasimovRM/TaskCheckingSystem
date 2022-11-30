from typing import List, Union

from pydantic import BaseModel

from models.pydantic_sqlalchemy_core import LessonDto
from services.common import exclude_field, make_field_non_required, make_fields_non_required


class LessonDtoWithHiddenFlag(LessonDto):
    is_hidden: bool


class LessonsResponse(BaseModel):
    lessons: Union[List[LessonDtoWithHiddenFlag], List[LessonDto]]


class LessonResponse(LessonDto):
    pass


class LessonRequest(LessonDto):
    pass


@exclude_field("id")
class LessonPostRequest(LessonDto):
    pass


if __name__ == "__main__":
    print(*LessonPostRequest.__fields__.items(), sep='\n')
