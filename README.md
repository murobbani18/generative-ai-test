# Proyek API Gemini Multimodal

API ini berfungsi sebagai *backend* sederhana yang memungkinkan interaksi dengan model AI Gemini melalui beberapa *endpoint* yang berbeda. API ini mendukung input teks, gambar, dokumen, dan audio.

Proyek ini dibuat oleh **Mufti Robbani** untuk tugas kelas **AI Productivity and AI API Integration for Developers - PartnershipsH8 Session 4**.

## Fitur

* **Endpoint Teks**: `POST /generate-text` untuk input berbasis teks.
* **Endpoint Gambar**: `POST /generate-from-image` untuk input gambar.
* **Endpoint Dokumen**: `POST /generate-from-document` untuk input dokumen.
* **Endpoint Audio**: `POST /generate-from-audio` untuk input audio.
* **Pengelolaan File**: Menggunakan `multer` untuk mengelola unggahan dan `fs.unlinkSync()` untuk membersihkan file setelah diproses.

## Prasyarat

Pastikan Anda telah menginstal yang berikut ini:

* **Node.js**: Versi 18 atau yang lebih baru.
* **NPM** atau **Yarn**.
* **Gemini API Key**: Anda bisa mendapatkannya dari [Google AI Studio](https://aistudio.google.com/app/apikey).

## Instalasi

1.  **Clone repositori:**
    ```bash
    git clone https://github.com/murobbani18/generative-ai-test.git
    cd generative-ai-test
    ```

2.  **Instal dependensi:**
    ```bash
    npm install
    ```
    atau
    ```bash
    yarn install
    ```

3.  **Siapkan file `.env`:**
    Buat file baru bernama `.env` di direktori root proyek Anda atau anda juga bisa copy file `.env.example` dan beri nama hasil copy tadi menjadi `.env`. Selanjutnya tambahkan variabel berikut jika belum ada:
    ```
    PORT=3333
    GEMINI_API_KEY=PLACE_YOUR_GEMINI_API_KEY_HERE
    ```
    Ganti `PLACE_YOUR_GEMINI_API_KEY_HERE` dengan kunci API Gemini Anda.

## Penggunaan

Untuk menjalankan server, gunakan perintah berikut:

```bash
node server.js