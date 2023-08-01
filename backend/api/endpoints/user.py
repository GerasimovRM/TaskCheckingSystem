import logging

from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional, List

from sqlalchemy.ext.asyncio import AsyncSession

from database import User, UsersGroups, get_session, Solution
from models.pydantic_sqlalchemy_core import UserDto
from models.site.user import StudentsWithSolution
from services.auth_service import get_current_active_user, get_current_user, get_password_hash, \
    get_teacher_or_admin
from services.auth_service import verify_password
from api.deps import get_user_by_id, get_user_group, get_best_solutions, get_group_students


router = APIRouter(
    prefix="/user",
    tags=["user"]
)


@router.get("/", response_model=UserDto, dependencies=[
    Depends(get_current_active_user)
])
async def get_user_by_id(user: User = Depends(get_user_by_id)) -> UserDto:
    return UserDto.from_orm(user)


@router.get("/students_with_solution", response_model=List[StudentsWithSolution], dependencies=[
    Depends(get_teacher_or_admin),
    Depends(get_user_group)
])
async def get_students_solution(solutions: list[Solution] = Depends(get_best_solutions)) -> List[StudentsWithSolution]:
    return [StudentsWithSolution(user_id=solution.user_id,
                                 score=solution.score,
                                 time_start=solution.time_start,
                                 status=solution.status,
                                 time_finish=solution.time_finish) for solution in solutions]


@router.get("/students_group", response_model=List[UserDto], dependencies=[
    Depends(get_teacher_or_admin),
    Depends(get_user_group)
])
async def get_students_group(group_users: UsersGroups = Depends(get_group_students)) -> List[UserDto]:
    return list(map(UserDto.from_orm, map(lambda t: t.user, group_users)))


@router.post("/change_password/")
async def change_password(new_password: str,
                          current_password: Optional[str] = None,
                          current_user: User = Depends(get_current_user),
                          session: AsyncSession = Depends(get_session)):
    logging.info(current_user.password)
    if not current_user.password and not current_password:
        current_user.password = get_password_hash(new_password)
    elif verify_password(current_password, current_user.password):
        current_user.password = get_password_hash(new_password)
    else:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Wrong current password")
    await session.commit()
    return {"status": "Ok"}


@router.get("/get_data/", response_model=UserDto)
async def get_user_data(current_user: User = Depends(get_current_user)) -> UserDto:
    return UserDto.from_orm(current_user)


# TODO: поменять под метод из кастомного базового класса
@router.post("/change_data", response_model=UserDto)
async def change_user_data(first_name: Optional[str] = None,
                           last_name: Optional[str] = None,
                           middle_name: Optional[str] = None,
                           avatar_url: Optional[str] = None,
                           current_user: User = Depends(get_current_active_user),
                           session: AsyncSession = Depends(get_session)):
    if first_name:
        current_user.first_name = first_name
    if last_name:
        current_user.last_name = last_name
    if middle_name:
        current_user.middle_name = middle_name
    if avatar_url:
        current_user.avatar_url = avatar_url
    await session.commit()
    return UserDto.from_orm(current_user)
