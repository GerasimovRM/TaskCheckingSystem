import requests

from models import SolutionDto

from config_loader import ConfigLoader
from services.auth import AuthRequest

config = ConfigLoader()


class SolutionService:
    @staticmethod
    def update(changed_solution: SolutionDto):
        request = AuthRequest()
        req = request("put", "/solution", data=changed_solution.json())
        print(req.json())
        if req.status_code == 200:
            return req.json()
        else:
            # TODO: exceptions rework
            raise ValueError
