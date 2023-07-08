from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, User, GroupsCourses
from services.groups_courses_serivce import GroupsCoursesService
from services.auth_service import get_current_active_user

from models.pydantic_sqlalchemy_core import GroupsCoursesDto


router = APIRouter(
    prefix='/groups_courses',
    tags=['groups_courses']
)


@router.post('/', response_model=GroupsCoursesDto)
async def post_groups_courses(req: GroupsCoursesDto,
                              current_user: User = Depends(get_current_active_user),
                              session: AsyncSession = Depends(get_session)):
    db_item = GroupsCourses(**req.dict())

    session.add(db_item)
    await session.commit()
    return GroupsCoursesDto.from_orm(db_item)


@router.put('/', response_model=GroupsCoursesDto)
async def put_groups_courses(req: GroupsCoursesDto,
                             current_user: User = Depends(get_current_active_user),
                             session: AsyncSession = Depends(get_session)):
    db_item = await GroupsCoursesService.get_group_course(req.group_id, req.course_id, session)    
    db_item.update_by_pydantic(req)

    await session.commit()
    return GroupsCoursesDto.from_orm(db_item)


@router.delete('/')
async def delete_groups_courses(group_id: int,
                                course_id: int,
                                current_user: User = Depends(get_current_active_user),
                                session: AsyncSession = Depends(get_session)):
    db_item = await GroupsCoursesService.get_group_course(group_id, course_id, session)
    
    await session.delete(db_item)
    return {'detail': 'ok'}
