import asyncio
from datetime import datetime
import json

import aiokafka

from common.enum_encoder import EnumEncoder
from config_loader import ConfigLoader
from models import SolutionDto


async def produce():
    config = ConfigLoader()
    producer = aiokafka.AIOKafkaProducer(
        bootstrap_servers=config.KAFKA_URL,
        value_serializer=lambda solution: json.dumps(solution.dict(), cls=EnumEncoder).encode()
    )
    solution = SolutionDto(
        id=841,
        task_id=21,
        user_id=2,
        course_id=2,
        group_id=2,
        score=0,
        code="a = input()\nprint('Слово', a, 'имеет длину', len(a))",
        status=-1,
        time_start="2022-12-03 02:29:09.300708",
        test_type="PYTHON_IO",
        max_score=1
    )
    await producer.send(config.TASK_CHECKER_TOPIC_NAME, solution)
    await producer.stop()

asyncio.run(produce())