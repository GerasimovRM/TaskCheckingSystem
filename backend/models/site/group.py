from typing import List

from pydantic import BaseModel

from models import GroupDto


class GroupsResponse(BaseModel):
    groups: List[GroupDto]
