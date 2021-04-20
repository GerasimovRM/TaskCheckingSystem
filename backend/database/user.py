from typing import Optional, List
import hashlib
import base64

import ormar

from .base_meta import BaseMeta
from .database_settings import ENCRYPT_SECRET
from .course import Course
from .owners_courses import OwnersCourses
from .students_courses import StudentsCourses

secret = hashlib.sha256(ENCRYPT_SECRET.encode()).digest()
secret = base64.urlsafe_b64encode(secret)

roles = ["student", "teacher"]
statuses = ["undefined", "active", "locked"]


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
    role: str = ormar.String(max_length=10)
    status: str = ormar.String(max_length=10)
    owner_courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                             through=OwnersCourses,
                                                             through_relation_name="owner_id",
                                                             through_reverse_relation_name="course_id",
                                                             related_name="owners_courses")
    student_courses: Optional[List[Course]] = ormar.ManyToMany(Course,
                                                               through=StudentsCourses,
                                                               through_relation_name="student_id",
                                                               through_reverse_relation_name="course_id",
                                                               related_name="students_courses")
