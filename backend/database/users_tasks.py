from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class UsersTasks(Base):
    __tablename__ = "dbo_users_tasks"
    task_id = Column(ForeignKey("dbo_task.id"), primary_key=True)
    user_id = Column(ForeignKey("dbo_user.id"), primary_key=True)

    user = relationship("User", back_populates="tasks", lazy="selectin")
    task = relationship("Task", back_populates="users", lazy="selectin")
