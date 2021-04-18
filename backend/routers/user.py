from fastapi import APIRouter

router = APIRouter()


@router.get("/users/", tags=["users"])
async def auth():
    return 'hehe'
