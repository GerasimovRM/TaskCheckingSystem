from typing import Optional

import ormar

from .base_meta import BaseMeta


TEST_TYPES = ["input", "code"]
TEST_INPUT_FORMATS = {"input": ".txt", "code": ".py"}
TEST_OUTPUT_FORMATS = {"input": ".txt", "code": ".txt"}


class Test(ormar.Model):
    class Meta(BaseMeta):
        tablename = "test"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)
    type: str = ormar.String(max_length=10)
    input: str = None  # TODO: бинарники на входе
    output: str = None  # TODO: бинарники на выходе
