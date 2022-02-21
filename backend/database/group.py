from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Group(Base):
    __tablename__ = "dbo_group"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(40))

    users = relationship("UsersGroups", back_populates="group", lazy="selectin")
    courses = relationship("GroupsCourses", back_populates="group", lazy="selectin")
    user_tcg = relationship("UsersTasksCoursesGroups", back_populates="group", lazy="selectin")
