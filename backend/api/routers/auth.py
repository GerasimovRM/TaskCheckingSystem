import aiohttp
import json
from typing import Optional

from pydantic import ValidationError
from fastapi import APIRouter, status, HTTPException, Cookie

from models import ResponseVkAccessToken, Token
from config import VK_CLIENT_ID, VK_CLIENT_SECRET, VK_REDIRECT_URI
from database import User, RefreshToken
from services.auth_service import create_access_token_user, create_refresh_token_user
from services.auth_service import get_password_hash, get_admin
from services.vk_service import get_vk_user_with_photo
from models import UserDto


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/login", response_model=Token)
async def login(vk_code: str):
    """
    usr = await User.objects.get(id=1)
    print(usr)
    usr.password = get_password_hash("123")
    print(usr)
    await usr.update()
    return "123"
    """
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
        if db_user:
            db_user.vk_access_token = response_vk_access_token.access_token
            await db_user.update()
        else:
            vk_user = await get_vk_user_with_photo(response_vk_access_token.access_token)
            db_user = User(**vk_user.dict(), access_token=response_vk_access_token.access_token)
            await db_user.save()

        return Token(access_token=await create_access_token_user(db_user),
                     refresh_token=await create_refresh_token_user(db_user))
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=json.loads(e.json()))


@router.get("/refresh_token", response_model=Token)
async def refresh(refresh_token: Optional[str] = Cookie(None)):
    db_refresh_token = await RefreshToken.objects.get_or_none(token=refresh_token)
    if db_refresh_token:
        db_user = db_refresh_token.user
        await db_refresh_token.delete()
        return Token(access_token=await create_access_token_user(db_user),
                     refresh_token=await create_refresh_token_user(db_user))
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad refresh token. Need to reauthorize.")
