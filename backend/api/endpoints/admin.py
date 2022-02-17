from fastapi import APIRouter, status, HTTPException, Depends

from services.auth_service import get_admin, get_password_hash
from database import User, Admin


router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


@router.post("/change_user_password")
async def change_user_password(user_id: int,
                               new_password: str,
                               current_user: User = Depends(get_admin)):
    db_user: User = await User.objects.get_or_none(id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id {user_id} not found")
    if current_user.id == user_id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Need to use /user/change_password to change password yourself")
    db_admin = await Admin.objects.get_or_none(user=db_user)
    if db_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"You can not change password to other admins")
    db_user.password = get_password_hash(new_password)
    await db_user.update()
    return {"status": "Ok"}
