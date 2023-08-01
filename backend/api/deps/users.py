from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, User, Group, UsersGroups, GroupsCourses
from services.users_groups_service import UsersGroupsService
from services.groups_courses_serivce import GroupsCoursesService
from services.auth_service import get_current_active_user
from services.group_service import GroupService
from services.user_service import UserService


async def get_user_by_id(
    user_id: int,
    session: AsyncSession = Depends(get_session)
) -> User:
    user = await UserService.get_user_by_id(user_id, session)

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id {user_id} not found")
    
    return user
