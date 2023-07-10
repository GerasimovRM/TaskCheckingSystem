from typing import List, Any

from models.pydantic_sqlalchemy_core import SolutionDto
from ws.websocket_connector import WebSocketConnector


class WebSocketSolution(WebSocketConnector):
    # task_id, user_id, course_id, group_id
    _instances = {}

    def __init__(self,
                 task_id: int,
                 user_id: int,
                 course_id: int,
                 group_id: int,
                 *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.task_id: int = task_id
        # self.user_id: int = user_id
        # self.course_id: int = course_id
        # self.group_id: int = group_id
        self.ids = (task_id, user_id, course_id, group_id)
        self.__add_websocket_to_instances()

    def __add_websocket_to_instances(self):
        if not WebSocketSolution._instances.get(self.ids, None):
            WebSocketSolution._instances[self.ids] = []
        WebSocketSolution._instances[self.ids].append(self)

    @staticmethod
    def get_websockets_by_ids(*args) -> List[Any] | None:
        # when 1 tuple
        if len(args) == 1 and isinstance(args[0], tuple):
            return WebSocketSolution._instances.get(*args, [])
        # when 4 args (ids)
        elif len(args) == 4 and all(map(lambda arg: isinstance(arg, int), args)):
            return WebSocketSolution._instances.get(args, [])
        raise KeyError

    def remove_from_instances(self):
        WebSocketSolution._instances[self.ids].remove(self)
        if not WebSocketSolution._instances[self.ids]:
            WebSocketSolution._instances.pop(self.ids)

    @staticmethod
    async def broadcast_new_solution_to_websockets(updated_solution: SolutionDto,
                                                   task_id: int,
                                                   user_id: int,
                                                   course_id: int,
                                                   group_id: int):
        websockets = WebSocketSolution.get_websockets_by_ids(task_id, user_id, course_id, group_id)
        for websocket in websockets:
            websocket: WebSocketSolution
            await websocket.add_data_to_queue(updated_solution)