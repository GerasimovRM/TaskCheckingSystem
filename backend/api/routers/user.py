from fastapi import Depends, APIRouter

from models import UserDto
from database import User
from services import get_current_active_user


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.get("/me/", response_model=UserDto)
async def read_users_me(current_user: User = Depends(get_current_active_user)):
    return UserDto(**current_user.dict())


@router.get("/me/items/")
async def read_own_items(current_user: User = Depends(get_current_active_user)):
    return [{"item_id": "Foo", "owner": current_user.id}]

