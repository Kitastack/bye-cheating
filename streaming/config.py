from pydantic_settings import BaseSettings

hostname: str = "0.0.0.0"


class Settings(BaseSettings):

    app_name: str = "Streaming Bye Cheating API"
    path_model: str = "./model/best.pt"
    grpc_host: str = hostname
    grpc_port: int = 50051
    host: str = hostname
    port: int = 9000
    redis_host: str = "192.168.137.1"
    redis_port: int = 6379


settings = Settings()
