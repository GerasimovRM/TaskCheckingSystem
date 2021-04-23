from fastapi import APIRouter, status, HTTPException
import aiohttp
from services import ResponseVkAccessToken
from pydantic import ValidationError
from datetime import timedelta

from errors import BaseError
from config import ACCESS_TOKEN_EXPIRE_MINUTES, VK_CLIENT_ID, VK_CLIENT_SECRET, VK_REDIRECT_URI
from database import User
from services import create_token_user
from models import UserDto


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/login")
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
            data = await response.json()
            try:
                # TODO: expires_in and access_token fields not used
                response_vk_access_token = ResponseVkAccessToken(**data)
                user = await User.objects.get_or_none(vk_id=response_vk_access_token.user_id)
                if user:
                    user.access_token = response_vk_access_token.access_token
                    user.jwt_token = create_token_user(user)
                    print(user.dict())
                    return UserDto(**user.dict())
                return response_vk_access_token
            except ValidationError:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=BaseError(**data).dict())
