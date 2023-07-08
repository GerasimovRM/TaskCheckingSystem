from typing import List
from fastapi import HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database import UsersGroups, User
from database.users_groups import UserGroupRole
from services.user_service import UserService

class UsersGroupsService:
    @staticmethod
    async def get_user_group(user_id: int,
                             group_id: int,
                             session: AsyncSession) -> UsersGroups:
        query = await session.execute(select(UsersGroups)
                                      .where(UsersGroups.user_id == user_id,
                                             UsersGroups.group_id == group_id))
        user_group = query.scalars().first()

        if not user_group and not UserService.is_admin(user_id, session):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Bad access to group")

        return user_group

    @staticmethod
    async def get_user_groups(user_id: int,
                              session: AsyncSession) -> List[UsersGroups]:
        query = await session.execute(select(UsersGroups)
                                      .where(UsersGroups.user_id == user_id)
                                      .options(joinedload(UsersGroups.group)))
        user_groups = query.scalars().all()
        return user_groups

    @staticmethod
    async def get_user_group_teacher_or_admin(user_id: int,
                                              group_id: int,
                                              session: AsyncSession) -> UsersGroups:
        query = await session.execute(select(UsersGroups)
                                      .where(UsersGroups.user_id == user_id,
                                             UsersGroups.group_id == group_id,
                                             UsersGroups.role != UserGroupRole.STUDENT))
        user_group = query.scalars().first()

        if not user_group:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail="Bad access to group")

        return user_group

    @staticmethod
    async def get_group_students(group_id: int,
                                 session: AsyncSession) -> List[User]:
        query = await session.execute(select(UsersGroups).join(UsersGroups.user)
                                      .where(UsersGroups.group_id == group_id,
                                             UsersGroups.role == UserGroupRole.STUDENT)
                                      .options(joinedload(UsersGroups.user))
                                      .order_by(User.last_name, User.first_name))
        group_users = query.scalars().all()
        return group_users

    @staticmethod
    async def get_group_users(group_id: int,
                              session: AsyncSession) -> List[User]:
        query = await session.execute(select(UsersGroups).join(UsersGroups.user)
                                      .where(UsersGroups.group_id == group_id)
                                      .options(joinedload(UsersGroups.user))
                                      .order_by(User.last_name.asc()))
        group_users = query.scalars().all()
        return group_users
