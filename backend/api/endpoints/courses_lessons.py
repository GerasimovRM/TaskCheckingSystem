from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, CoursesLessons
from services.auth_service import get_current_active_user
from models.pydantic_sqlalchemy_core import CoursesLessonsDto
from api.deps import get_course_lesson

router = APIRouter(
    prefix='/courses_lessons',
    tags=['courses_lessons']
)


@router.post('/', response_model=CoursesLessonsDto, dependencies=[
    Depends(get_current_active_user)
])
async def post_courses_lessons(req: CoursesLessonsDto,
                               session: AsyncSession = Depends(get_session)):
    db_item = CoursesLessons(**req.dict())

    session.add(db_item)
    await session.commit()
    return CoursesLessonsDto.from_orm(db_item)


@router.get('/get_one', response_model=CoursesLessonsDto, dependencies=[
    Depends(get_current_active_user)
])
async def get_courses_lessons_by_id(courses_lessons: CoursesLessons = Depends(get_course_lesson)):
    return CoursesLessonsDto.from_orm(courses_lessons)


@router.put('/', response_model=CoursesLessonsDto, dependencies=[
    Depends(get_current_active_user)
])
async def put_courses_lessons(req: CoursesLessonsDto,  # что делать с depends и req? 
                              courses_lessons: CoursesLessons = Depends(get_course_lesson),
                              session: AsyncSession = Depends(get_session)):
    courses_lessons.update_by_pydantic(req)
    await session.commit()
    return CoursesLessonsDto.from_orm(courses_lessons)


@router.delete('/', dependencies=[
    Depends(get_current_active_user)
])
async def delete_courses_lessons(courses_lessons: CoursesLessons = Depends(get_course_lesson),
                                 session: AsyncSession = Depends(get_session)):    
    await session.delete(courses_lessons)
    return {'detail': 'ok'}
