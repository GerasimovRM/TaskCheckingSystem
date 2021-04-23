from pydantic import BaseModel


class UserDto(BaseModel):
    id: int
    first_name: str
    last_name: str
    middle_name: str
    vk_id: str
    status: int
    jwt_token: str


