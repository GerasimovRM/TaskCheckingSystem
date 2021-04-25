from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional

from models import UserDto
from database import User
from services import get_current_active_user, get_current_user, get_password_hash, verify_password


router = APIRouter(
    prefix="/users",
    tags=["users"]
)


@router.post("/change_password/")
async def change_password(new_password: str,
                          current_password: Optional[str] = None,
                          current_user: User = Depends(get_current_user)):
    if not current_user.password and not current_password:
        current_user.password = get_password_hash(new_password)
    elif verify_password(current_password, current_user.password):
        current_user.password = get_password_hash(new_password)
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Wrong current password")
    await current_user.update()
    return {"status": "Ok"}


@router.get("/get_user_data/", response_model=UserDto)
async def get_user_data(current_user: User = Depends(get_current_user)):
    return UserDto(**current_user.dict())

# @router.post("/")
