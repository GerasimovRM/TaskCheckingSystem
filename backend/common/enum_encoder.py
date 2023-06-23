import json
from datetime import datetime
from enum import Enum


class TaskCheckerEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Enum):
            return obj.name
        if isinstance(obj, datetime):
            return str(obj)
        return json.JSONEncoder.default(self, obj)
