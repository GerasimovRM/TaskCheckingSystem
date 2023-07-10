from fastapi import WebSocket, APIRouter

from ws.routes.websocket_solution import WebSocketSolution

router = APIRouter(prefix="/solution",
                   tags=["solution"])


# @router.websocket("/ws")
# async def websocket_endpoint(websocket: WebSocket):
#     connector = WebSocketConnector(websocket)
#     await connector.run()


@router.websocket("/{task_id}/{user_id}/{course_id}/{group_id}")
async def websocket_endpoint(websocket: WebSocket,
                             task_id: int,
                             user_id: int,
                             course_id: int,
                             group_id: int):
    connector = WebSocketSolution(task_id, user_id, course_id, group_id, websocket)
    await connector.run()


@router.get("/get_websocket_connections")
async def get_ws(task_id: int,
                 user_id: int,
                 course_id: int,
                 group_id: int):
    return list(map(str, WebSocketSolution.get_websockets_by_ids(task_id,
                                                                 user_id,
                                                                 course_id,
                                                                 group_id)))
