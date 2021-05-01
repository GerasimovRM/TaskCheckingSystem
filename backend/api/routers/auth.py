import aiohttp
import json

from pydantic import ValidationError
from fastapi import APIRouter, status, HTTPException

from models import ResponseVkAccessToken
from config import VK_CLIENT_ID, VK_CLIENT_SECRET, VK_REDIRECT_URI
from database import User
from services import create_token_user, get_vk_user_with_photo, get_password_hash
from services.auth_service import get_admin
from models import UserDto


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/login", response_model=str)
async def login(vk_code: str):
    async with aiohttp.ClientSession() as session:
        data = {
            "client_id": VK_CLIENT_ID,
            "client_secret": VK_CLIENT_SECRET,
            "redirect_uri": VK_REDIRECT_URI,
            "code": vk_code,
            "scope": "offline"
        }
        async with session.get("https://oauth.vk.com/access_token", params=data) as response:
            response_data = await response.json()
            try:
                response_vk_access_token = ResponseVkAccessToken(**response_data)
            except ValidationError as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=response_data)
    try:
        db_user = await User.objects.get_or_none(vk_id=response_vk_access_token.user_id)
        await get_admin(db_user)
        if db_user:
            db_user.access_token = response_vk_access_token.access_token
            await db_user.update()
        else:
            vk_user = await get_vk_user_with_photo(response_vk_access_token.access_token)
            db_user = User(**vk_user.dict(), access_token=response_vk_access_token.access_token)
            await db_user.save()

        return create_token_user(db_user)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=json.loads(e.json()))
