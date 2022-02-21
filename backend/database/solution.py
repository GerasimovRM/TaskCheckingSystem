from sqlalchemy import Column, Integer, String, Float, ForeignKeyConstraint
from sqlalchemy.orm import relationship

from database import Base


class Solution(Base):
    __tablename__ = "dbo_solution"

    id = Column(Integer, primary_key=True, autoincrement=True)
    # TODO: data_code
    score = Column(Integer, default=0, nullable=False)
    user_id = Column(Integer, primary_key=True)
    task_id = Column(Integer, primary_key=True)
    course_id = Column(Integer, primary_key=True)
    group_id = Column(Integer, primary_key=True)

    user_tcg = relationship("UsersTasksCoursesGroups", back_populates="solutions", lazy="selectin")

    __table_args__ = (
        ForeignKeyConstraint(
            ("user_id", "task_id", "course_id", "group_id"),
            ("dbo_users_tasks_courses_groups.user_id",
             "dbo_users_tasks_courses_groups.task_id",
             "dbo_users_tasks_courses_groups.course_id",
             "dbo_users_tasks_courses_groups.group_id"),
            use_alter=True, name="dbo_solution_fkey"
        ),
    )
