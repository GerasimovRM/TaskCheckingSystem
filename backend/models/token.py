from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenWithAvatar(Token):
    avatar_url: str


class TokenData(BaseModel):
    vk_id: Optional[str] = None
