from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session

from database import User
from database.base_meta import initialize_database, get_session
from database.user import UserStatus
from models import UserDto
from models.token import Token
from services.auth_service import create_access_token_user, create_refresh_token_user, \
    authenticate_user, get_current_active_user, get_password_hash, get_user
from api.endpoints import user_router, auth_router
# , admin_router, help_models_router, course_router, teacher_router
"""
import logging
logger = logging.getLogger("databases")
logger.setLevel(logging.DEBUG)
"""
app = FastAPI(docs_url="/")
#app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(user_router)
#app.include_router(help_models_router)
#app.include_router(course_router)
#app.include_router(teacher_router)

# app.state.database = database


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(),
                                 session: AsyncSession = Depends(get_session)):
    user = await authenticate_user(form_data.username, form_data.password, session)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=await create_access_token_user(user),
                 refresh_token=await create_refresh_token_user(user, session))


@app.get("/users/me")
async def read_users_me(current_user: User = Depends(get_current_active_user)) -> UserDto:
    return UserDto.from_orm(current_user)


@app.on_event("startup")
async def startup() -> None:
    await initialize_database()


@app.on_event("shutdown")
async def shutdown() -> None:
    # TODO: close connection
    pass

"""
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "https://localhost:5000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
"""

if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=5000, log_level="info")
