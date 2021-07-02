from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional
from datetime import datetime, timedelta
from pydantic import BaseModel

from database.user import User, UserStatus
from database.admin import Admin
from database.teacher import Teacher
from database.refresh_token import RefreshToken
from models import TokenData, Token
from config import SECRET_KEY, JWT_ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def create_access_token_user(user: User) -> str:
    jwt_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    jwt_token = create_jwt_token(
        data={"vk_id": user.vk_id}, expires_delta=jwt_token_expires)
    return jwt_token


async def create_refresh_token_user(user: User) -> str:
    jwt_token = create_jwt_token(data={"vk_id": user.vk_id}, verify_exp=False)
    db_refresh_token = RefreshToken(token=jwt_token, user=user)
    await db_refresh_token.save()
    return jwt_token


def verify_password(plain_password, hashed_password) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    return pwd_context.hash(password)


async def get_user(vk_id: str) -> User:
    user = await User.objects.get(vk_id=vk_id)
    return user


async def authenticate_user(vk_id: str, password: str) -> Optional[User]:
    user = await get_user(vk_id)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user


def create_jwt_token(data: dict,
                     expires_delta: Optional[timedelta] = None,
                     verify_exp: bool = True) -> str:
    to_encode = data.copy()
    if verify_exp:
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    else:
        expire = datetime.utcnow()
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=JWT_ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
        vk_id: str = payload.get("vk_id")
        if vk_id is None:
            raise credentials_exception
        token_data = TokenData(vk_id=vk_id)
    except JWTError:
        raise credentials_exception
    user = await get_user(token_data.vk_id)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.status != UserStatus.ACTIVE:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user


async def get_admin(current_user: User = Depends(get_current_active_user)) -> User:
    admin = await Admin.objects.get_or_none(user=current_user)
    if not admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bad access")
    return current_user


async def get_teacher(current_user: User = Depends(get_current_active_user)) -> User:
    teacher = await Teacher.objects.get_or_none(user=current_user)
    if not teacher:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bad access")
    return current_user


async def get_teacher_or_admin(current_user: User = Depends(get_current_active_user)) -> User:
    teacher = await get_teacher(current_user)
    admin = await get_admin(current_user)
    if all([teacher, admin]):
        return current_user
    else:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Bad access")


