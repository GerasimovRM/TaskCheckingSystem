from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, LessonsTasks
from services.auth_service import get_current_active_user
from models.pydantic_sqlalchemy_core import LessonsTasksDto
from api.deps import get_lesson_task

router = APIRouter(
    prefix='/lessons_tasks',
    tags=['lessons_tasks']
)


@router.post('/', response_model=LessonsTasksDto, dependencies=[
    Depends(get_current_active_user)
])
async def post_lessons_tasks(req: LessonsTasksDto,
                             session: AsyncSession = Depends(get_session)):
    db_item = LessonsTasks(**req.dict())
    
    session.add(db_item)
    await session.commit()
    return LessonsTasksDto.from_orm(db_item)


@router.get('/get_one', response_model=LessonsTasksDto, dependencies=[
    Depends(get_current_active_user)
])
async def get_lessons_tasks_by_id(lesson_task: LessonsTasks = Depends(get_lesson_task)):    
    return LessonsTasksDto.from_orm(lesson_task)


@router.put('/', response_model=LessonsTasksDto, dependencies=[
    Depends(get_current_active_user)
])
async def put_lessons_tasks(req: LessonsTasksDto,
                            lesson_task: LessonsTasks = Depends(get_lesson_task),
                            session: AsyncSession = Depends(get_session)):
    lesson_task.update_by_pydantic(req)
    await session.commit()
    return LessonsTasksDto.from_orm(lesson_task)


@router.delete('/', dependencies=[
    Depends(get_current_active_user)
])
async def delete_lessons_tasks(lesson_task: LessonsTasks = Depends(get_lesson_task),
                               session: AsyncSession = Depends(get_session)):
    await session.delete(lesson_task)
    return {'detail': 'ok'}
