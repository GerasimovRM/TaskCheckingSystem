from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from database import get_session, User, UsersGroups, GroupsCourses
from services.users_groups_service import UsersGroupsService
from services.groups_courses_serivce import GroupsCoursesService
from services.auth_service import get_current_active_user


async def get_user_group(
    group_id: int,
    current_user: User = Depends(get_current_active_user),
    session: AsyncSession = Depends(get_session)
) -> UsersGroups:
    user_group = await UsersGroupsService.get_user_group(current_user.id, group_id, session)
    if not user_group:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to group"
        )
    return user_group


async def get_group_course(
    group_id: int,
    course_id: int,
    session: AsyncSession = Depends(get_session)
) -> GroupsCourses:
    group_course = await GroupsCoursesService.get_group_course(group_id, course_id, session)
    if not group_course:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad access to course")
    return group_course