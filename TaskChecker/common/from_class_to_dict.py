class FromClassToDict:
    def __call__(self, *args, **kwargs):
        return self.__dict__

