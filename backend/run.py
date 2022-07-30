from api.server import app
import uvicorn

if __name__ == "__main__":
    uvicorn.run("run:app", host="localhost", port=5000, log_level="info", reload=True)
