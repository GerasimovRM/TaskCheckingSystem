from pydantic import BaseModel


class BaseError(BaseModel):
    error: str
    error_description: str
