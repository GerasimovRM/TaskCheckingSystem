import asyncio
import json

from aiokafka import AIOKafkaProducer

from common import MetaSingleton
from common.enum_encoder import TaskCheckerEncoder
from config import KAFKA_URL, TASK_CHECKER_TOPIC_NAME
from models.pydantic_sqlalchemy_core import SolutionDto
from models.site.solution import SolutionForTaskChecker


class TaskCheckerProducer(AIOKafkaProducer, metaclass=MetaSingleton):
    def __init__(self):
        loop = asyncio.get_event_loop()
        super().__init__(bootstrap_servers=KAFKA_URL,
                         value_serializer=self.serializer,
                         loop=loop)

    @staticmethod
    def serializer(solution: SolutionForTaskChecker):
        return json.dumps(solution.dict(), cls=TaskCheckerEncoder).encode()

    @staticmethod
    async def produce(solution: SolutionForTaskChecker):
        producer = TaskCheckerProducer()
        # s = TaskCheckerProducer.serializer(solution)
        await producer.send(TASK_CHECKER_TOPIC_NAME, solution)
