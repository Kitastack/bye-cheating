# Bye-Cheating

Sebuah aplikasi mendeteksi kecurangan ujian melalui sistem pendeteksis CCTV menggunakan Algoritma YOLOv7 Terintegrasi dengan website

## Prasyarat

- `node 20` atau terbaru
- `python 3.12`
- `ffmpeg`, dapat diunduh di [situs resmi](https://www.ffmpeg.org/download.html)

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
