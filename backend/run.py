import uvicorn


if __name__ == "__main__":
    uvicorn.run("api.server:app", host="127.0.0.1", port=5000)
