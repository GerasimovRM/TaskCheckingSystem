from typing import Union

from common import FromClassToDict


class EpicboxFile(FromClassToDict):
    def __init__(self, name: str, content: Union[str, bytes]):
        self.name = name
        self.content = content if isinstance(content, bytes) else content.encode()

    def get_file(self):
        return self()

    def __repr__(self):
        return str(self())


if __name__ == "__main__":
    print(EpicboxFile('main.py', "print(123)").get_file())
