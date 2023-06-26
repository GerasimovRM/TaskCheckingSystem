from asyncio import Queue
from typing import Type

from fastapi import WebSocket


class WebSocketConnector(WebSocket):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.queue = Queue()


class WebSocketSolution(WebSocketConnector):
    _instances = {}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
