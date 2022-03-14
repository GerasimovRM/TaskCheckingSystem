from typing import List, Optional

from models import LessonDto
from pydantic import BaseModel, validator

from models import BaseTaskDto


"""
BaseTaskDto.__fields__ == {'id': ModelField(name='id', type=int, required=True),
'name': ModelField(name='name', type=Optional[str], required=False, default=None),
'description': ModelField(name='description', type=Optional[str], required=False, default=None),
'max_score': ModelField(name='max_score', type=Optional[float], required=False, default=None)}
"""


class GroupCourseLessonTaskResponse(BaseModel):
    tasks: List[LessonDto]
    course_name: str
    course_description: Optional[str]
