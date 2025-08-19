import "dotenv/config";
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js';
import cookieParser from "cookie-parser";
import { sessionMiddleware } from "./middlewares/session.js";
import apiLimiter from "./middlewares/rateLimiter.js";

const { PORT, FRONTEND_URL } = process.env;

const app = express();

// 🎉 Tambahkan ini untuk mendapatkan IP asli klien dari header X-Forwarded-For
app.set('trust proxy', 1); // atau gunakan 'loopback' atau '127.0.0.1' jika perlu

app.use(apiLimiter); 

const origin = FRONTEND_URL || 'http://localhost:80';
const corsOptions = { 
  origin: origin,
  credentials: true, // enable cookies
}

app.use(cors(corsOptions));
console.log("cors options", corsOptions)
// biar req.body bisa dibaca
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);

app.get('/', (req, res) => res.send('Hello from the server!'));

app.use('/v1', apiRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
