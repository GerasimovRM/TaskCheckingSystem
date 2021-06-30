from typing import Optional, List
from fastapi import APIRouter, status, HTTPException, Depends

from services.auth_service import get_admin, get_password_hash, get_current_active_user
from database import User, Course
from models import CourseDto, UserDto, LessonDto


router = APIRouter(
    prefix="/course",
    tags=["course"]
)


@router.get("/{course_id}", response_model=CourseDto)
async def get_course(course_id: int,
                     current_user: User = Depends(get_current_active_user)) -> CourseDto:
    pass