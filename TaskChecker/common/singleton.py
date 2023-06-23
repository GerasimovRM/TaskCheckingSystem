# https://github.com/KrasnovVitaliy/microservice_in_python/blob/e4142f7e2fc28aec68fc1471fc7c77ed0cdd8a5d/06_db_loader/app/singleton.py#L4
class MetaSingleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(MetaSingleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]
