from typing import Optional, List
from pydantic import BaseModel

from .user_dto import UserDto


class GroupDto(BaseModel):
    id: int
    name: str


class UserInGroupDto(UserDto):
    user_group_role: Optional[int]


class GroupForTeacherOrAdminDto(GroupDto):
    users: List[UserInGroupDto]

