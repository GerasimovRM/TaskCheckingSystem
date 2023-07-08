from fastapi import HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import Course


class CourseService:
    @staticmethod
    async def get_course(course_id: int,
                         session: AsyncSession) -> Course:
        query = await session.execute(select(Course)
                                      .where(Course.id == course_id))
        course = query.scalars().first()

        if not course:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Course with id {course_id} not found")

        return course
