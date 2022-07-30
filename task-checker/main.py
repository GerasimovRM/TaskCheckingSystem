if __name__ == "__main__":
    import epicbox

    epicbox.configure(
        profiles=[
            epicbox.Profile('python', 'python:3.6.5-alpine')
        ]
    )
    with open("test.py", "rb") as input_file:
        content = input_file.read()
    files = [{'name': 'main.py', 'content': content}]
    limits = {'cputime': 1, 'memory': 64}

    result = epicbox.run('python', 'python3 main.py', files=files, limits=limits)
    print(result)