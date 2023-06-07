from pydantic import BaseModel


class AuthLogin(BaseModel):
    login: str
    password: str
