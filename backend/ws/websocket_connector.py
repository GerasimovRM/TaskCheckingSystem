import asyncio
from abc import ABCMeta, abstractmethod
from asyncio import Queue

from starlette.websockets import WebSocketState, WebSocket

from common.enum_encoder import TaskCheckerEncoder
from models.pydantic_sqlalchemy_core import SolutionDto


class WebSocketConnector(metaclass=ABCMeta):
    def __init__(self, websocket: WebSocket, timeout: int = 1):
        self.websocket = websocket
        self.queue = Queue()
        self.timeout = timeout

    async def add_data_to_queue(self, data):
        await self.queue.put(data)

    async def get_data_from_socket(self):
        # need for recive close of connection
        async for _ in self.websocket.iter_text():
            pass

    async def read_data_from_queue_and_send_to_socket(self):
        while True:
            try:
                async with asyncio.timeout(self.timeout):
                    data: SolutionDto = await self.queue.get()
                    t = data.json(cls=TaskCheckerEncoder)
                    await self.websocket.send_text(t)
            except TimeoutError:
                if self.websocket.client_state == WebSocketState.DISCONNECTED:
                    self.remove_from_instances()
                    break

    async def run(self):
        await self.websocket.accept()
        await asyncio.gather(self.read_data_from_queue_and_send_to_socket(),
                             self.get_data_from_socket())

    @abstractmethod
    def remove_from_instances(self):
        ...
