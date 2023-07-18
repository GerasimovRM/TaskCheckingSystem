from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from services.admin_service import AdminService
from services.auth_service import get_admin, get_password_hash
from database import User, get_session
from api.deps import get_user_by_id

router = APIRouter(
    prefix="/admin",
    tags=["admin"]
)


@router.post("/change_user_password")
async def change_user_password(new_password: str,
                               user: User = Depends(get_user_by_id),
                               current_user: User = Depends(get_admin),
                               session: AsyncSession = Depends(get_session)):
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"User with id {user.id} not found")
    if current_user.id == user.id:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,
                            detail=f"Need to use /user/change_password to change password yourself")
    db_admin = AdminService.get_admin(user.id, session)
    if db_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"You can not change password to other admins")
    user.password = get_password_hash(new_password)
    await session.commit()
    return {"status": "Ok"}
