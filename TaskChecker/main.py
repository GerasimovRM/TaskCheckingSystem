import asyncio
import logging

from aiokafka import AIOKafkaConsumer

from config_loader import ConfigLoader
from kafka_consumer import KafkaConsumer

logging.basicConfig(level=logging.INFO)

consumer = KafkaConsumer()
loop = asyncio.get_event_loop()
loop.run_until_complete(consumer.listen())

# async def consume():
#     config = ConfigLoader()
#     consumer = AIOKafkaConsumer(config.TASK_CHECKER_TOPIC_NAME,
#                                 bootstrap_servers="localhost:29092",
#                                 auto_offset_reset='earliest',
#                                 group_id=config.TASK_CHECKER_GROUP_NAME,
#                                 value_deserializer=KafkaConsumer.solution_deserializer,
#                                 enable_auto_commit=False)
#     await consumer.start()
#     while True:
#         msg = await consumer.getone()
#         print(msg.value)
#
# asyncio.run(consume())