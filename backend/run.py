import uvicorn
from config import SERVER_HOST, SERVER_PORT


if __name__ == "__main__":
    uvicorn.run("api.server:app", host=SERVER_HOST, port=SERVER_PORT)
