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
    git clone <URL_REPOSITORI_ANDA>
    cd <NAMA_FOLDER_PROYEK>
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
    Buat file baru bernama `.env` di direktori root proyek Anda dan tambahkan variabel berikut:
    ```
    PORT=3333
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```
    Ganti `YOUR_API_KEY_HERE` dengan kunci API Gemini Anda.

## Penggunaan

Untuk menjalankan server, gunakan perintah berikut:

```bash
node server.js