import asyncio

from database import User, async_session
from database.user import UserStatus


async def main():
    async with async_session() as session:
        async with session.begin():
            user = User(first_name="a", last_name='b', status=UserStatus.ACTIVE)
            session.add(user)
            await session.flush()


asyncio.get_event_loop().run_until_complete(main())
