# GenAI Project

Ini adalah project chatbot menggunakan **Google Gemini API**, dengan **frontend React + Vite** dan **backend Node.js + Express**, serta **Redis** untuk menyimpan session/chat history.

Proyek ini dibuat oleh **Mufti Robbani** untuk tugas akhir dari kelas **AI Productivity and AI API Integration for Developers - PartnershipsH8 Session 5**. Proyek ini adalah lanjutan dari session 4 yang bisa dilihat di branch session-4.

---

## Struktur Project

```
.
├── docker-compose.yml
├── frontend
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   ├── logo.png
│   │   └── vite.svg
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── components
│   │   │   └── Chatbot.tsx
│   │   ├── hooks
│   │   │   └── useChatApi.ts
│   │   ├── index.css
│   │   ├── main.tsx
│   │   └── vite-env.d.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
└── server
    ├── controllers
    │   └── chatController.js
    ├── Dockerfile
    ├── middlewares
    │   ├── session.js
    │   └── uploadMiddleware.js
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── routes
    │   └── api.js
    ├── server.js
    ├── server.js.bak
    ├── services
    │   ├── geminiService.js
    │   └── redisService.js
    ├── services.js
    └── uploads
```

---

## Requirements

- Docker & Docker Compose
- Node.js (untuk development lokal)
- .env file di `frontend` & `server`:
  - `FRONTEND_URL` → URL frontend
  - `PORT` → port backend
  - API keys untuk Gemini (`GENAI_API_KEY`) dan Redis (`REDIS_HOST`, `REDIS_PORT`)

---

## Menjalankan Project

1. Build & jalankan semua container:

```bash
docker compose up -d --build
```

2. Stop semua container:

```bash
docker compose down
```

3. Logs backend:

```bash
docker logs -f genai-backend
```

4. Logs frontend:

```bash
docker logs -f genai-frontend
```

---

## Frontend

**Entry point:** `frontend/src/main.tsx`
- **Hooks:** `frontend/src/hooks/useChatApi.ts`
- **Komponen utama:** `frontend/src/components/Chatbot.tsx`
- **Environment variable:** `VITE_API_URL` (endpoint backend)


### Cara Jalankan Lokal (Tanpa Docker)

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

**Entry point:** `server/server.js`

### Struktur Penting

- **Middlewares**
  - `middlewares/session.js` → membuat `sessionId` otomatis untuk setiap user
  - `middlewares/uploadMiddleware.js` → menangani upload file
- **Controllers**
  - `controllers/chatController.js` → menangani request chat, memanggil Gemini API, dan menyimpan riwayat ke Redis
- **Services**
  - `services/redisService.js` → koneksi dan operasi ke Redis
  - `services/geminiService.js` → koneksi ke Google Gemini API

### Jalankan Backend Lokal (Tanpa Docker)

```bash
cd server
npm install
npm run start
```

- Pastikan backend dapat mengakses Redis
- Pastikan environment variable diisi, misal: `PORT`, `FRONTEND_URL`, `GENAI_API_KEY`, dll.

### Pengaturan Cookie untuk Cross-Origin

```js
// server/middlewares/session.js

res.cookie("sessionId", sessionId, {
  httpOnly: true,
  secure: true,      // wajib true jika sameSite: "none"
  sameSite: "none",
  maxAge: 24 * 60 * 60 * 1000, // 1 hari
});
```

### Semua request chat dari frontend harus menyertakan:

```ts
// frontend/src/hooks/useChatApi.ts

const res = await fetch(API_URL + '/chat', {
  method: 'POST',
  body: formData,
  credentials: 'include', // penting agar cookie sessionId dikirim ke backend
});
```

- Hal ini memastikan cookie `sessionId` yang dibuat oleh backend ikut dikirim bersama request.  
- Dengan begitu, backend bisa memuat history chat dari Redis yang sesuai dengan session tersebut dan menyimpan balasan model di session yang sama.

