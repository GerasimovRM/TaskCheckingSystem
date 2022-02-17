from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import relationship

from database import Base


class Task(Base):
    __tablename__ = "dbo_task"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(40))
    description = Column(String(4000), nullable=True)
    max_score = Column(Float)

    lessons = relationship("LessonsTasks", back_populates="task", lazy="selectin")
    users = relationship("UsersTasks", back_populates="task", lazy="selectin")