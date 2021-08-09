from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from datetime import timedelta

from database.base_meta import database
from models.token import Token
from services.auth_service import create_access_token_user, create_refresh_token_user, authenticate_user
from api.endpoints import user_router, auth_router, admin_router, help_models_router, course_router


app = FastAPI()
app.include_router(admin_router)
app.include_router(auth_router)
app.include_router(user_router)
app.include_router(help_models_router)
app.include_router(course_router)

app.state.database = database


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=await create_access_token_user(user),
                 refresh_token=await create_refresh_token_user(user))


@app.on_event("startup")
async def startup() -> None:
    if not app.state.database.is_connected:
        await app.state.database.connect()


@app.on_event("shutdown")
async def shutdown() -> None:

    if app.state.database.is_connected:
        await app.state.database.disconnect()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


if __name__ == "__main__":
    uvicorn.run("server:app", host="127.0.0.1", port=5000, log_level="info")
