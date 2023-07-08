from typing import List
from fastapi import HTTPException, status

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from database import User, Admin, Teacher


class UserService:
    @staticmethod
    async def get_user_by_id(user_id: int,
                             session: AsyncSession) -> User:
        query = await session.execute(select(User)
                                      .where(User.id == user_id))
        user = query.scalars().first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"User with id {user_id} not found")

        return user

    @staticmethod
    async def get_user_by_vk_id(vk_id: str,
                                session: AsyncSession) -> User | None:
        t = select(User).where(User.vk_id == vk_id)
        query = await session.execute(t)
        db_user = query.scalars().first()
        return db_user

    @staticmethod
    async def get_user_by_login(login: str,
                                session: AsyncSession) -> User | None:
        sql = select(User).where(User.login == login)
        query = await session.execute(sql)
        db_user = query.scalars().first()
        return db_user

    # @staticmethod
    # async def get_user_by_login_and_password(login: str,
    #                                          password: str,
    #                                          session: AsyncSession) -> User | None:
    #     user = await UserService.get_user_by_login(login, session)


    @staticmethod
    async def is_admin(user_id: int,
                       session: AsyncSession) -> bool:
        admin_query = await session.execute(select(Admin)
                                            .where(Admin.user_id == user_id))
        admin = admin_query.scalars().first()
        # if admin:
        #     return True
        # else:
        #     return False
        return bool(admin)

    @staticmethod
    async def is_teacher(user_id: int,
                         session: AsyncSession) -> bool:
        teacher_query = await session.execute(select(Teacher)
                                              .where(Teacher.user_id == user_id))
        teacher = teacher_query.scalars().first()
        if teacher:
            return True
        else:
            return False

    @staticmethod
    async def is_admin_or_teacher(user_id: int,
                                  session: AsyncSession) -> bool:
        is_admin = await UserService.is_admin(user_id, session)
        if is_admin:
            return True
        is_teacher = await UserService.is_teacher(user_id, session)
        if is_teacher:
            return True
        return False

    @staticmethod
    async def get_students_by_group_id(group_id: int,
                                       session) -> List[User]:
        from services.users_groups_service import UsersGroupsService

        group_students = await UsersGroupsService.get_group_students(group_id, session)
        return list(map(lambda g_s: g_s.user, group_students))
