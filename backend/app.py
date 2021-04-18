from fastapi import FastAPI
import uvicorn

from database.base_meta import database, metadata
from database.user import User


app = FastAPI()
app.state.database = database


@app.on_event("startup")
async def startup() -> None:
    database_ = app.state.database
    if not database_.is_connected:
        await database_.connect()

    # await User(first_name='df', last_name="123", middle_name="123").save()


@app.on_event("shutdown")
async def shutdown() -> None:
    database_ = app.state.database
    if database_.is_connected:
        await database_.disconnect()


@app.get("/user_create")
async def create_user(pas):
    u = {
        "first_name": "123",
        "last_name": "123",
        "middle_name": "123",
        "password": "123"}

    user = User(**u)
    await user.save()
    return user.check_password(pas)

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=5000, log_level="info")