from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database.base_meta import BaseSQLAlchemyModel


class SolutionsDockerRunImages(BaseSQLAlchemyModel):
    __tablename__ = "dbo_solutions_docker_run_images"

    solution_id = Column(ForeignKey("dbo_solution.id"), primary_key=True)
    docker_run_image_id = Column(ForeignKey("dbo_docker_run_image.id"), primary_key=True)

    solution = relationship("Solution", back_populates="docker_run_images")
    docker_run_image = relationship("DockerRunImage", back_populates="solutions")
