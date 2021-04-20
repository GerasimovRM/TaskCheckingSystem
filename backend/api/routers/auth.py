from fastapi import APIRouter
import aiohttp
from typing import Union

from config import VK_CLIENT_ID, VK_CLIENT_SECRET, VK_REDIRECT_URI
from services import ResponseVkAccessToken
from pydantic import ValidationError
from errors import BaseError


router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


@router.get("/login/")
async def login(vk_code: str) -> [ResponseVkAccessToken, BaseError]:
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
                return response_vk_access_token
            except ValidationError:
                return BaseError(**data)
