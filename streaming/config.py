from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "Streaming Bye Cheating API"
    path_model: str = "./model/best.pt"
    grpc_host: str = "0.0.0.0"
    grpc_port: int = 50051
    host: str = "0.0.0.0"
    port: int = 9000
    redis_host: str = "192.168.1.3"
    redis_port: int = 6379


settings = Settings()
