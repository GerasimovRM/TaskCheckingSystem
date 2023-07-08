from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, CoursesLessons, User
from services.courses_lessons_service import CoursesLessonsService
from services.auth_service import get_current_active_user

from models.pydantic_sqlalchemy_core import CoursesLessonsDto


router = APIRouter(
    prefix='/courses_lessons',
    tags=['courses_lessons']
)


@router.post('/', response_model=CoursesLessonsDto)
async def post_courses_lessons(req: CoursesLessonsDto,
                               current_user: User = Depends(get_current_active_user),
                               session: AsyncSession = Depends(get_session)):
    db_item = CoursesLessons(**req.dict())

    session.add(db_item)
    await session.commit()
    return CoursesLessonsDto.from_orm(db_item)


@router.get('/get_one', response_model=CoursesLessonsDto)
async def get_courses_lessons_by_id(course_id: int,
                                    lesson_id: int,
                                    current_user: User = Depends(get_current_active_user),
                                    session: AsyncSession = Depends(get_session)):
    db_item = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
    return CoursesLessonsDto.from_orm(db_item)


@router.put('/', response_model=CoursesLessonsDto)
async def put_courses_lessons(req: CoursesLessonsDto,
                              current_user: User = Depends(get_current_active_user),
                              session: AsyncSession = Depends(get_session)):
    db_item = await CoursesLessonsService.get_course_lesson(req.course_id, req.lesson_id, session)
    db_item.update_by_pydantic(req)

    await session.commit()
    return CoursesLessonsDto.from_orm(db_item)


@router.delete('/')
async def delete_courses_lessons(course_id: int,
                                 lesson_id: int,
                                 current_user: User = Depends(get_current_active_user),
                                 session: AsyncSession = Depends(get_session)):
    db_item = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
    
    await session.delete(db_item)
    return {'detail': 'ok'}
