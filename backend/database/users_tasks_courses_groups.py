from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class UsersTasksCoursesGroups(Base):  # user_tcg
    __tablename__ = "dbo_users_tasks_courses_groups"
    task_id = Column(ForeignKey("dbo_task.id"), primary_key=True)
    user_id = Column(ForeignKey("dbo_user.id"), primary_key=True)
    course_id = Column(ForeignKey("dbo_course.id"), primary_key=True)
    group_id = Column(ForeignKey("dbo_group.id"), primary_key=True)

    user = relationship("User", back_populates="user_tcg", lazy="selectin")
    task = relationship("Task", back_populates="user_tcg", lazy="selectin")
    course = relationship("Course", back_populates="user_tcg", lazy="selectin")
    group = relationship("Group", back_populates="user_tcg", lazy="selectin")

    solutions = relationship("Solution", back_populates="user_tcg", lazy="selectin")
