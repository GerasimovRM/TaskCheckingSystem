import asyncio
from asyncio import Queue
from typing import List

import websockets
from fastapi import FastAPI, WebSocket, APIRouter
from fastapi.responses import HTMLResponse
from starlette.websockets import WebSocketDisconnect

router = APIRouter(prefix="/chat")

html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var ws = new WebSocket("ws://localhost:5500/chat/ws");
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""


@router.get("/")
async def get():
    return HTMLResponse(html)


class Notifier:
    def __init__(self):
        self.connections: List[WebSocket] = []
        self.generator = self.get_notification_generator()

    async def get_notification_generator(self):
        while True:
            message = yield
            await self._notify(message)

    async def push(self, msg: str):
        await self.generator.asend(msg)

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.connections.append(websocket)

    def remove(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def _notify(self, message: str):
        living_connections = []
        while len(self.connections) > 0:
            # Looping like this is necessary in case a disconnection is handled
            # during await websocket.send_text(message)
            websocket = self.connections.pop()
            await websocket.send_text(message)
            living_connections.append(websocket)
        self.connections = living_connections


notifier = Notifier()

active_websockets = []

queue = asyncio.queues.Queue()


@router.websocket("/ws/{item_id}")
async def websocket_endpoint(websocket: WebSocket, item_id: int):
    print(websocket.session)
    await websocket.accept()

    async def read_from_socket(websocket: WebSocket):
        async for data in websocket.iter_text():
            print(f"putting {data} in the queue")
            queue.put_nowait(data)

    async def get_data_and_send():
        while True:
            data = await queue.get()
            print(f'data->{data}')
            fetch_task = await websocket.send_text(data)
            print(fetch_task)

    await asyncio.gather(read_from_socket(websocket), get_data_and_send())

# @router.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     await notifier.connect(websocket)
#     print('ws open')
#     try:
#         while True:
#             await we
#             data = await websocket.receive_text()
#             await websocket.send_text(f"Message text was: {data}")
#     except WebSocketDisconnect:
#         notifier.remove(websocket)

@router.get("/push/{message}")
async def push_to_connected_websockets(message: str):
    await notifier.push(f"! Push notification: {message} !")


@router.get("/msg")
async def end_msg(message: str):
    await queue.put(message)

@router.on_event("startup")
async def startup():
    # Prime the push notification generator
    await notifier.generator.asend(None)
