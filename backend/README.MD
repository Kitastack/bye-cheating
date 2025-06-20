# Bye Cheating Backend

Pengembangan backend menggunakan microservices architecture dan dockerize untuk YOLOv7.

## Arsitektur

![Preview arsitektur yang digunakan](../images/architecture.backend.png)

## Spesifikasi Minimum

### Hardware

| Component                  | Minimum                                             | Recommended\*                                   | Maximum   |
| -------------------------- | --------------------------------------------------- | ----------------------------------------------- | --------- |
| CPU socket                 | 1.3 GHz (64-bit processor) or faster for multi-core | 3.1 GHz (64-bit processor) or faster multi-core | 2 sockets |
| Memory (RAM)               | 8 GB                                                | 16 GB                                           | 64 GB     |
| Hard disks dan penyimpanan | 10 GB hard disk with a 60 GB system partition       |                                                 | No limit  |

### Software

- `node 18` atau terbaru
- `python 3.12`
- `ffmpeg`, dapat diunduh di [situs resmi](https://www.ffmpeg.org/download.html)
- `ultralytics`, lihat dokumentasi lengkap di [situs resmi](https://docs.ultralytics.com/models/yolov7/)
- `fastapi`, lihat dokumentasi lengkap di [situs resmi](https://fastapi.tiangolo.com/)
- `nginx`, lihat dokumentasi lengkap di [situs resmi](https://www.docker.com/)
- `redis`, lihat dokumentasi lengkap di [situs resmi](https://redis.io/)
- `docker & docker compose`, lihat dokumentasi lengkap di [situs resmi](https://www.docker.com/)

## Instalasi

1.  Pastikan sudah menginstall docker. Jika belum bisa unduh melalui [situs docker](https://docs.docker.com/engine/install/)
2.  Buka terminal dan masuk ke dalam folder [backend](./)
3.  Jalankan perintah berikut pada terminal

    ```
    docker compose up -d
    ```

4.  Anda dapat menggunakan [Docker Desktop](https://www.docker.com/products/docker-desktop/) untuk memonitoring server yang sudah di **build** pada poin ke 3
5.  Kemudian server dapat diakses melalui [http://127.0.0.1:8080](http://127.0.0.1:8080)

## Instalasi Manual

Untuk melakukan langkah ini, ada beberapa hal yang Anda perlu ketahui:

- Server report pada [services/report](./services/report/) sebagai Restful API untuk koneksi ke website.
- Server machine_learning pada [services/model](./services/model/) sebagai Restful API untuk model.
- Hasil yang didapatkan berupa 2 server masing-masing sebagai container.

![Preview container](../images/container.backend.png)

> Berikut langkah untuk menginstall `service/report`:

1.  Buka terminal dan masuk ke dalam folder [utama](./) dimana terdapat file [compose.yml](./compose.yml)
2.  Jalankan perintah berikut pada terminal

    ```
    docker compose up --build report-service -d
    ```

    > gunakan -d jika Anda ingin server berjalan pada background. (Anda bisa melakukan monitoring melalui software docker)

3.  Anda dapat mengakses server dapat diakses melalui [http://127.0.0.1:8000](http://127.0.0.1:8000)

> Berikut langkah untuk menginstall `service/model`:

1.  Buka terminal dan masuk ke dalam folder [utama](./) dimana terdapat file [compose.yml](./compose.yml)
2.  Jalankan perintah berikut pada terminal

    ```
    docker compose up --build model-service -d
    ```

3.  Anda dapat mengakses server dapat diakses melalui [http://127.0.0.1:8000](http://127.0.0.1:8000)
