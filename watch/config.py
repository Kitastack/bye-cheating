from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):

    app_name: str = "Watcher Service Api"
    path_model: str = "./model/best.pt"
    # -1 for CPU, 0 for GPU
    port: int = (lambda port_num: 9092 if port_num is None else port_num)(
        os.getenv("PORT")
    )
    host: str = (lambda hostname: "0.0.0.0" if hostname is None else hostname)(
        os.getenv("HOSTNAME")
    )
    redis_channel: str = (lambda redis: "default" if redis is None else redis)(
        os.getenv("REDIS_CHANNEL")
    )
    minio_access_key: str = (
        lambda access_key: "minioadmin" if access_key is None else access_key
    )(os.getenv("MINIO_ACCESS_KEY"))
    minio_secret_key: str = (
        lambda secret_key: "minioadmin" if secret_key is None else secret_key
    )(os.getenv("MINIO_SECRET_KEY"))
    minio_hostname: str = (
        lambda minio_host: "0.0.0.0:9000" if minio_host is None else minio_host
    )(os.getenv("MINIO_HOSTNAME"))
    minio_hostname_public: str = (
        lambda minio_host_public: (
            "0.0.0.0:9000" if minio_host_public is None else minio_host_public
        )
    )(os.getenv("MINIO_HOSTNAME_PUBLIC"))
    minio_bucket: str = (lambda bucket: "default" if bucket is None else bucket)(
        os.getenv("MINIO_BUCKET")
    )
    device: str | int = (
        lambda model_device: "cpu" if model_device is None else model_device
    )(os.getenv("DEVICE"))
    redis_url: str = (
        lambda redis: "redis://localhost:6379" if redis is None else redis
    )(os.getenv("REDIS_URL"))
    general_service_url: str = (
        lambda general_service: (
            "http://localhost:9091" if general_service is None else general_service
        )
    )(os.getenv("GENERAL_SERVICE_URL"))


settings = Settings()
