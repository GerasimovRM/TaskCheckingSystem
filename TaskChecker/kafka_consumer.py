from aiokafka import AIOKafkaConsumer

from config_loader import ConfigLoader


class KafkaConsumer(AIOKafkaConsumer):
    def __init__(self, *args, **kwargs):
        config = ConfigLoader()
        super().__init__(config.TASK_CHECKER_TOPIC_NAME,
                         *args, **kwargs)



