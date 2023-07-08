from typing import List
from fastapi import HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from database import User, UsersGroups, Group, GroupsCourses
from database.users_groups import UserGroupRole


class GroupService:
    @staticmethod
    async def get_group_by_id(group_id: int,
                              session: AsyncSession) -> Group:
        query = await session.execute(select(Group)
                                      .where(Group.id == group_id))
        group = query.scalars().first()

        if not group:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Group with id {group_id} not found")

        return group

    @staticmethod
    async def get_group_by_id_with_courses(group_id: int,
                                           session: AsyncSession) -> Group:
        query = await session.execute(select(Group)
                                      .where(Group.id == group_id)
                                      .options(joinedload(Group.courses).joinedload(GroupsCourses.course)))
        group = query.scalars().first()
        return group

