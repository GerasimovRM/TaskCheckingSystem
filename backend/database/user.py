import ormar
from .base_meta import BaseMeta


class User(ormar.Model):
    class Meta(BaseMeta):
        tablename = "user"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    first_name: str = ormar.String(max_length=100)
    last_name: str = ormar.String(max_length=100)

