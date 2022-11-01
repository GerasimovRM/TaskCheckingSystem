from enum import IntEnum

from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship

from database.base_meta import BaseSQLAlchemyModel


class TaskType(IntEnum):
    CLASS_WORK = 1
    HOME_WORK = 2
    ADDITIONAL_WORK = 3


class LessonsTasks(BaseSQLAlchemyModel):
    __tablename__ = "dbo_lessons_tasks"

    lesson_id = Column(ForeignKey("dbo_lesson.id"), primary_key=True)
    task_id = Column(ForeignKey("dbo_task.id"), primary_key=True)
    queue_number = Column(Integer)
    task_type = Column(Enum(TaskType))

    lesson = relationship("Lesson", back_populates="tasks")
    task = relationship("Task", back_populates="lessons")
