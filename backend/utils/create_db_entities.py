import asyncio
from database.base_meta import metadata, engine, async_session


async def create_db_entities():
    async with engine.begin() as conn:
        await conn.run_sync(metadata.drop_all)
        await conn.run_sync(metadata.create_all)


asyncio.get_event_loop().run_until_complete(create_db_entities())