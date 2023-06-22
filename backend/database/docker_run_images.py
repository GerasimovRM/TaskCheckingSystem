from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database.base_meta import BaseSQLAlchemyModel


class DockerRunImage(BaseSQLAlchemyModel):
    __tablename__ = "dbo_docker_run_image"
    id = Column(Integer, primary_key=True, autoincrement=True)
    signature = Column(String(40), unique=True)
    docker_image = Column(String(100), nullable=False)

    solutions = relationship("SolutionsDockerRunImages", back_populates="docker_run_image")
