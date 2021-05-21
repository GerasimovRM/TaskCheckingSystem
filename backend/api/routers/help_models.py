from fastapi import APIRouter, Depends
from pydantic.schema import model_schema

from services.auth_service import get_admin
from database import User
from database.users_courses import UserCourseRole
from database.user import UserStatus
from database.users_tasks import UserTaskStatus


router = APIRouter(
    prefix="/help_models",
    tags=["help_models"]
)


async def help_model_to_json(model, fields_type):
    return dict(map(lambda t: (t, fields_type(model[t])),
                    filter(lambda x: not x.startswith("__"), dir(model))))


@router.get("/user_course_role/")
async def user_course_role(current_user: User = Depends(get_admin)):
    return await help_model_to_json(UserCourseRole, int)


@router.get("/user_status/")
async def user_status(current_user: User = Depends(get_admin)):
    return await help_model_to_json(UserStatus, int)


@router.get("/users_task_status/")
async def user_status(current_user: User = Depends(get_admin)):
    return await help_model_to_json(UserTaskStatus, int)