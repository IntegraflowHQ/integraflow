import uvicorn

config = uvicorn.Config(
    "integraflow.asgi:application", port=8000, reload=True, lifespan="off"
)
server = uvicorn.Server(config)
server.run()
