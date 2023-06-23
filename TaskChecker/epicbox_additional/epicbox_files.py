from typing import List

from common import FromClassToDict
from epicbox_additional import EpicboxFile


class EpicboxFiles(FromClassToDict):
    def __init__(self, files: List[EpicboxFile]):
        self.files = files

    def get_files(self):
        return list(map(EpicboxFile.get_file, self.files))


if __name__ == "__main__":
    file1 = EpicboxFile("main.py", "print(123)")
    file2 = EpicboxFile("main2.py", "print(123)")
    files = EpicboxFiles([file1, file2])
    print(files())