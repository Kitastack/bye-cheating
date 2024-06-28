# Bye Cheating Backend

Pengembangan backend menggunakan microservices architecture dan dockerize

## Arsitektur

![Preview arsitektur yang digunakan](../images/architecture.backend.png)

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

Untuk melakukan langkah ini, ada dua hal yang perlu Anda ketahui:

- Server report pada services/report sebagai Restful API untuk koneksi ke website
- Server machine_learning pada services/model sebagai Restful API untuk model
