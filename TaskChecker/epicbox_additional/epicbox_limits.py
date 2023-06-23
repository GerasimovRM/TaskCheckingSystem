from common import FromClassToDict


class EpicboxLimits(FromClassToDict):
    def __init__(self, cputime: int = 10, memory: int = 10):
        self.cputime = cputime
        self.memory = memory

    def get_limtis(self):
        return self()


if __name__ == "__main__":
    print(EpicboxLimits().get_limtis())
