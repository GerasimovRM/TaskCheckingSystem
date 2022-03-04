import uvicorn
from config import SERVER_HOST, SERVER_PORT


if __name__ == "__main__":
    uvicorn.run("api.server:app", host="127.0.0.1", port=SERVER_PORT, reload=True)
