from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from database.users_groups import UserGroupRole
from models.pydantic_sqlalchemy_core import GroupDto
from models.site.group import GroupsResponse
from services.auth_service import get_admin, get_teacher_or_admin
from database import Group, UsersGroups, get_session
from api.deps import get_user_group, get_user_groups, get_group_by_id

router = APIRouter(
    prefix="/group",
    tags=["group"]
)


@router.get("/role", response_model=UserGroupRole)
async def get_role(user_group: UsersGroups = Depends(get_user_group)) -> UserGroupRole:
    return user_group.role


@router.get("/get_all", response_model=GroupsResponse)
async def get_user_groups(user_groups: list[UsersGroups] = Depends(get_user_groups)) -> GroupsResponse:
    groups = list(map(lambda t: t.group, user_groups))
    groups_dto = list(map(lambda t: GroupDto.from_orm(t), groups))
    return GroupsResponse(groups=sorted(groups_dto, key=lambda t: t.id))


@router.get("/{group_id}", response_model=GroupDto, dependencies=[
    Depends(get_user_group)
])
async def get_group(group: Group = Depends(get_group_by_id)) -> GroupDto:
    return GroupDto.from_orm(group)


@router.put("/{group_id}", response_model=GroupDto, dependencies=[
    Depends(get_user_group),
    Depends(get_admin)
])
async def put_group(group: Group = Depends(get_group_by_id),
                    group_name: Optional[str] = None,  # TODO: to pydantic json validation fields
                    session: AsyncSession = Depends(get_session)) -> GroupDto:
    if group_name:  # TODO: убрать деревенщину. Сделать на общий случай нормальные json
        group.name = group_name
    
    await session.commit()
    return GroupDto.from_orm(group)


@router.delete("/{group_id}", response_model=GroupDto, dependencies=[
    Depends(get_user_group),
    Depends(get_admin)
])
async def delete_group(group: Group = Depends(get_group_by_id),
                       session: AsyncSession = Depends(get_session)):
    await session.delete(group)
    await session.commit()
    # TODO: сделать response общим классом
    return {"detail": "ok"}


@router.post("/", response_model=GroupDto, dependencies=[
    Depends(get_teacher_or_admin)
])
async def post_group(group_name: str,
                     session: AsyncSession = Depends(get_session)) -> GroupDto:
    # TODO: засунуть сюда метод из класса вместо изменения вручную
    new_group = Group(name=group_name)
    session.add(new_group)
    await session.commit()
    return GroupDto.from_orm(Group)
