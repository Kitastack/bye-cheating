# Bye-Cheating

Sebuah aplikasi mendeteksi kecurangan ujian melalui sistem pendeteksis CCTV menggunakan Algoritma YOLOv7 Terintegrasi dengan website

## Preview

![Preview aplikasi](images/preview.jpeg)

> Lihat demo aplikasi

- [Youtube](https://youtu.be/Jt4vekrCvrE)
- [Website](https://by-cheating.web.app/)

## Prasyarat

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
- `react.js`, lihat dokumentasi lengkap di [situs resmi](https://react.dev/)
- `vite`, lihat dokumentasi lengkap di [situs resmi](https://vitejs.dev/)

## Instalasi

1. Jalankan backend
   - dengan menggunakan terminal, masuk ke folder `backend/service`. di folder ini terdapat 2 buah file backend, yaitu:
     - model
     - report
   - lakukan instalasi menggunakan dokumentasi pada [folder backend](./backend/)
2. Jalankan frontend
   - menggunakan program console yang lain, masuk ke folder `frontend`
   - Jalankan perintah `npm i` untuk mengunduh dan mempersiapkan dependensi yang diperlukan
   - jalankan `npm run dev` di console, dan buka link frontend yang muncul pada console
