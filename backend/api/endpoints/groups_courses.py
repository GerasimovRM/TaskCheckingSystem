from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, GroupsCourses
from services.auth_service import get_current_active_user
from models.pydantic_sqlalchemy_core import GroupsCoursesDto
from api.deps import get_group_course

router = APIRouter(
    prefix='/groups_courses',
    tags=['groups_courses']
)


@router.post('/', response_model=GroupsCoursesDto, dependencies=[
    Depends(get_current_active_user)
])
async def post_groups_courses(req: GroupsCoursesDto,
                              session: AsyncSession = Depends(get_session)):
    db_item = GroupsCourses(**req.dict())

    session.add(db_item)
    await session.commit()
    return GroupsCoursesDto.from_orm(db_item)


# TODO: what to do with GET though? the only info stored is IDs


@router.put('/', response_model=GroupsCoursesDto, dependencies=[
    Depends(get_current_active_user)
])
async def put_groups_courses(req: GroupsCoursesDto,
                             group_course: GroupsCourses = Depends(get_group_course),
                             session: AsyncSession = Depends(get_session)):    
    group_course.update_by_pydantic(req)
    await session.commit()
    return GroupsCoursesDto.from_orm(group_course)


@router.delete('/', dependencies=[
    Depends(get_current_active_user)
])
async def delete_groups_courses(group_course: GroupsCourses = Depends(get_group_course),
                                session: AsyncSession = Depends(get_session)):
    await session.delete(group_course)
    return {'detail': 'ok'}
