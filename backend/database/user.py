import hashlib
import base64

import ormar

from .base_meta import BaseMeta
from .database_settings import ENCRYPT_SECRET

secret = hashlib.sha256(ENCRYPT_SECRET.encode()).digest()
secret = base64.urlsafe_b64encode(secret)


class User(ormar.Model):
    class Meta(BaseMeta):
        tablename = "user"

    id: int = ormar.Integer(primary_key=True,
                            autoincrement=True)
    first_name: str = ormar.String(max_length=30)
    last_name: str = ormar.String(max_length=30)
    middle_name: str = ormar.String(max_length=30)
    password: str = ormar.String(max_length=100,
                                 encrypt_secret=ENCRYPT_SECRET,
                                 encrypt_backend=ormar.EncryptBackends.HASH)
    vk_id: str = ormar.String(max_length=20)
    