from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):

    app_name: str = "Streaming Bye Cheating API"
    path_model: str = "./model/best.pt"
    host: str = (lambda _hostname: "0.0.0.0" if _hostname is None else _hostname)(
        os.getenv("HOSTNAME")
    )
    port: int = (lambda _port: 8882 if _port is None else _port)(os.getenv("PORT"))
    redis_url: str = (
        lambda _redis: "redis://192.168.137.1:6379" if _redis is None else _redis
    )(os.getenv("REDIS_URL"))
    grpc_url: str = (lambda _grpc: "0.0.0.0:8880" if _grpc is None else _grpc)(
        os.getenv("GRPC_URL")
    )

    # grpc_host: str = os.getenv("GRPC_PORT")
    # grpc_port: int = os.getenv("GRPC_PORT")
    # redis_host: str = os.getenv("REDIS_HOST")
    # redis_port: int = os.getenv("REDIS_PORT")


settings = Settings()
