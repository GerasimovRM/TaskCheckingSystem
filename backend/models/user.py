from typing import Optional
from pydantic import BaseModel


class UserDto(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: Optional[str]
    vk_id: str
    status: int
    avatar_url: Optional[str]
