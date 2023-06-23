import asyncio
import json
import logging

from aiokafka import AIOKafkaConsumer

from config_loader import ConfigLoader
from languages import get_class_by_test_type, Multilanguage
from models import SolutionDto


class KafkaConsumer(AIOKafkaConsumer):
    def __init__(self):
        config = ConfigLoader()
        super().__init__(config.TASK_CHECKER_TOPIC_NAME,
                         bootstrap_servers=config.KAFKA_URL,
                         auto_offset_reset='earliest',
                         group_id=config.TASK_CHECKER_GROUP_NAME,
                         value_deserializer=KafkaConsumer.solution_deserializer,
                         enable_auto_commit=False,
                         loop=asyncio.get_event_loop())

    @staticmethod
    def solution_deserializer(serialized) -> SolutionDto:
        json_solution = json.loads(serialized)
        return SolutionDto(**json_solution)

    async def listen(self):
        await self.start()
        # try:
        while True:
            msg = await self.getone()
            solution: SolutionDto = msg.value
            cls_test = get_class_by_test_type(solution.test_type)
            task_checker: Multilanguage = cls_test(solution)
            task_checker.run_tests()
            logging.info(f"Solution {task_checker.solution.id} return with status {task_checker.solution.status}")
            await self.commit()
        # except Exception as ex:
        #     print(ex)
        #     logging.info(ex)
        #     await self.stop()
