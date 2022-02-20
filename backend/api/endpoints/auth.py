import aiohttp
import json
from typing import Optional

from pydantic import ValidationError
from fastapi import APIRouter, status, HTTPException, Cookie, Depends, Response
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import ResponseVkAccessToken, Token
from config import VK_CLIENT_ID, VK_CLIENT_SECRET, VK_REDIRECT_URI
from database import User, RefreshToken, get_session
from services.auth_service import create_access_token_user, create_refresh_token_user
from services.auth_service import get_password_hash
from services.vk_service import get_vk_user_with_photo

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/login", response_model=Token)
async def login(response: Response,
                vk_code: str, password: Optional[str] = None,
                session: AsyncSession = Depends(get_session)):
    async with aiohttp.ClientSession() as http_session:
        data = {
            "client_id": VK_CLIENT_ID,
            "client_secret": VK_CLIENT_SECRET,
            "redirect_uri": VK_REDIRECT_URI,
            "code": vk_code,
            "scopes": "photos"
        }

        async with http_session.get("https://oauth.vk.com/access_token", params=data) as response_session:
            print(response_session.url)
            response_data = await response_session.json()
            try:
                response_vk_access_token = ResponseVkAccessToken(**response_data)
            except ValidationError as e:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail=response_data)
    try:
        query = await session.execute(select(User).where(User.vk_id == response_vk_access_token.user_id))
        db_user = query.scalars().first()
        if db_user:
            if password:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Bad field password. Use /user/change_password")
            else:
                db_user.vk_access_token = response_vk_access_token.access_token
                await session.commit()
        else:
            vk_user = await get_vk_user_with_photo(response_vk_access_token.access_token)
            if password:
                db_user = User(**vk_user.dict(),
                               vk_access_token=response_vk_access_token.access_token,
                               password=get_password_hash(password))
            else:
                db_user = User(**vk_user.dict(),
                               vk_access_token=response_vk_access_token.access_token)
            await session.commit()
        jwt_access_token = await create_access_token_user(db_user)
        jwt_refresh_token = await create_refresh_token_user(db_user, session)
        response.set_cookie("refresh_token", jwt_refresh_token, httponly=True)
        return Token(access_token=jwt_access_token)
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=json.loads(e.json()))


# TODO: Rework. Use: https://indominusbyte.github.io/fastapi-jwt-auth/usage/refresh/
@router.get("/refresh_token", response_model=Token)
async def refresh(response: Response,
                  refresh_token: Optional[str] = Cookie(None),
                  session: AsyncSession = Depends(get_session)):
    query = await session.execute(select(RefreshToken).where(RefreshToken.token == refresh_token))
    db_refresh_token = query.scalars().first()
    if db_refresh_token:
        db_user = db_refresh_token.user
        jwt_access_token = await create_access_token_user(db_user)
        jwt_refresh_token = await create_refresh_token_user(db_user, session, refresh_token)
        response.set_cookie("refresh_token", jwt_refresh_token, httponly=True)
        return Token(access_token=jwt_access_token)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Bad refresh token. Need to reauthorize.")
