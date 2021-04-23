from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from database.user import User, UserStatus
from models import TokenData
from config import SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class ResponseVkAccessToken(BaseModel):
    access_token: str
    expires_in: int
    user_id: str


def create_token_user(user: User):
    jwt_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = create_access_token(
        data={"vk_id": user.vk_id}, expires_delta=jwt_token_expires)
    return jwt_token


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(vk_id: str) -> User:
    user = await User.objects.get(vk_id=vk_id)
    return user


async def authenticate_user(vk_id: str, password: str):
    user = await get_user(vk_id)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        print(payload)
        vk_id: str = payload.get("vk_id")
        if vk_id is None:
            raise credentials_exception
        token_data = TokenData(vk_id=vk_id)
    except JWTError:
        raise credentials_exception
    print(token_data, 'hah')
    user = await get_user(token_data.vk_id)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
