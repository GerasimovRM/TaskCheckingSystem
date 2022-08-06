from enum import IntEnum

from sqlalchemy import Column, Integer, String, Float, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy.orm import relationship

from database import Base
from database.base_meta import BaseSQLAlchemyModel
from database.solution import SolutionStatus


class TaskTestType(Enum, str):
    STDIN = "STDIN"
    CODE = "CODE"


class TaskTest(BaseSQLAlchemyModel):
    __tablename__ = "dbo_task_test"

    id = Column(Integer, primary_key=True, autoincrement=True)
    queue = Column(Integer, nullable=True)
    input_data = Column(String, nullable=True)
    output_data = Column(String, nullable=True)

    task_id = Column(Integer, ForeignKey("dbo_task.id"))
    task = relationship("Task", back_populates="task_test")
