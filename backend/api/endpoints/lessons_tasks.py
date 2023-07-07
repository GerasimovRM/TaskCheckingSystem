from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, User, LessonsTasks
from services.lessons_tasks_service import LessonsTasksService
from services.auth_service import get_current_active_user

from models.pydantic_sqlalchemy_core import LessonsTasksDto


router = APIRouter(
    prefix='/lessons_tasks',
    tags=['lessons_tasks']
)


@router.post('/', response_model=LessonsTasksDto)
async def post_lessons_tasks(req: LessonsTasksDto,
                             current_user: User = Depends(get_current_active_user),
                             session: AsyncSession = Depends(get_session)):
    db_item = LessonsTasks(**req.dict())
    
    session.add(db_item)
    await session.commit()
    return LessonsTasksDto.from_orm(db_item)


@router.get('/get_one', response_model=LessonsTasksDto)
async def get_lessons_tasks_by_id(lesson_id: int,
                                  task_id: int,
                                  current_user: User = Depends(get_current_active_user),
                                  session: AsyncSession = Depends(get_session)):
    db_item = await LessonsTasksService.get_lesson_task(lesson_id, task_id, session)

    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Can\'t find lessons-tasks relation by id {lesson_id}-{task_id}')
    
    return LessonsTasksDto.from_orm(db_item)


@router.put('/', response_model=LessonsTasksDto)
async def put_lessons_tasks(req: LessonsTasksDto,
                            current_user: User = Depends(get_current_active_user),
                            session: AsyncSession = Depends(get_session)):
    db_item = await LessonsTasksService.get_lesson_task(req.lesson_id, req.task_id, session)
    
    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Can\'t find lessons-tasks relation \
                                     by id {req.lesson_id}-{req.task_id}')

    db_item.update_by_pydantic(req)
    await session.commit()
    return LessonsTasksDto.from_orm(db_item)


@router.delete('/')
async def delete_lessons_tasks(lesson_id: int,
                               task_id: int,
                               current_user: User = Depends(get_current_active_user),
                               session: AsyncSession = Depends(get_session)):
    db_item = await LessonsTasksService.get_lesson_task(lesson_id, task_id, session)

    if not db_item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f'Can\'t find lessons-tasks relation by id {lesson_id}-{task_id}')

    await session.delete(db_item)
    return {'detail': 'ok'}
