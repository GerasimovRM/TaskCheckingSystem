from fastapi import APIRouter, Depends

from services.auth_service import get_admin, get_current_active_user
from database import User, Course
from database.user import UserStatus


router = APIRouter(
    prefix="/help_models",
    tags=["help_models"]
)


async def help_model_to_json(model, fields_type):
    return dict(map(lambda t: (t, fields_type(model[t])),
                    filter(lambda x: not x.startswith("__"), dir(model))))


@router.get("/user_status/")
async def user_status(current_user: User = Depends(get_admin)):
    return await help_model_to_json(UserStatus, int)


@router.get("/test")
async def test(current_user: User = Depends(get_current_active_user)):
    course = await Course.objects.select_related(Course.groups).get_or_none(id=1)
    group = course.groups[0]
    return group

