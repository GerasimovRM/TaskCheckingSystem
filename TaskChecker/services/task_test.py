from typing import List

from models import TaskTestDto
from services import AuthRequest


class TaskTestService:
    @staticmethod
    def get_by_task_id(task_id: int) -> List[TaskTestDto]:
        request = AuthRequest()
        req = request("get", "/task/tests", params={"task_id": task_id})
        # print(req)
        j = req.json()
        # print(j)
        return list(map(lambda task_test_json: TaskTestDto(**task_test_json), j))


if __name__ == "__main__":
    print(TaskTestService.get_by_task_id(12))
    print(TaskTestService.get_by_task_id(13))
