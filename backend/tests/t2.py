def func(x):
    print(*globals().items(), sep='\n')
    return x + y


a = 4