from languages.python.python_io import PythonIO
from languages.python.python_ut import PythonUT
from models import TestType


def get_class_by_test_type(test_type: str):
    # TODO: autogenerate it by class fields
    data = {
        "PYTHON_IO": PythonIO,
        "PYTHON_UT": PythonUT
    }
    cls = data[test_type]
    if cls:
        return cls
    raise ValueError(f"{test_type} not found!")
