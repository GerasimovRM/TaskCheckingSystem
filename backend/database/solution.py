from datetime import datetime
from enum import IntEnum, Enum as BaseEnum

from sqlalchemy import Column, Integer, String, Float, ForeignKeyConstraint, Boolean, Enum, \
    DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from database.base_meta import BaseSQLAlchemyModel


# !!! WARNING: class redirect to TaskChecker project !!!
class SolutionStatus(IntEnum):
    NOT_SENT: int = -2
    ERROR: int = -1
    ON_REVIEW: int = 0
    COMPLETE_NOT_MAX: int = 1
    COMPLETE: int = 2


class TestType(BaseEnum):
    PYTHON_IO = "PYTHON_IO"
    PYTHON_UT = "PYTHON_UT"


class Solution(BaseSQLAlchemyModel):
    __tablename__ = "dbo_solution"

    id = Column(Integer, primary_key=True, autoincrement=True)
    task_id = Column(ForeignKey("dbo_task.id"))
    user_id = Column(ForeignKey("dbo_user.id"))
    course_id = Column(ForeignKey("dbo_course.id"))
    group_id = Column(ForeignKey("dbo_group.id"))

    score = Column(Integer, default=0, nullable=False)
    code = Column(String, nullable=False)
    status = Column(Enum(SolutionStatus), nullable=False, default=SolutionStatus.ON_REVIEW)
    time_start = Column(DateTime, nullable=False, default=datetime.now)
    time_finish = Column(DateTime, nullable=True)
    check_system_answer = Column(String, nullable=True)
    test_type = Column(Enum(TestType), nullable=True)
    input_data = Column(Text, nullable=True)
    except_answer = Column(Text, nullable=True)
    user_answer = Column(Text, nullable=True)
    unit_test_code = Column(Text, nullable=True)

    user = relationship("User", back_populates="solutions")
    task = relationship("Task", back_populates="solutions")
    course = relationship("Course", back_populates="solutions")
    group = relationship("Group", back_populates="solutions")
    docker_run_images = relationship("SolutionsDockerRunImages", back_populates="solution")
