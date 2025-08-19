// server/middlewares/rateLimiter.js
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import redisClient from "../services/redisService.js"; // pastikan redisService.js juga pakai export default

// Konfigurasi Rate Limiter
const apiLimiter = rateLimit({
  // Gunakan Redis sebagai penyimpanan untuk rate limiter
  store: new RedisStore({
    sendCommand: (...args) => redisClient.sendCommand(args),
    prefix: "rate_limit:", // Opsional: tambahkan prefix untuk kunci Redis
  }),
  windowMs: 60 * 1000, // 1 menit
  max: 10, // Batas 10 permintaan per menit per IP
  message: {
    error: "Too many requests, please try again after a minute.",
  },
  standardHeaders: true, // Mengaktifkan header RateLimit-*
  legacyHeaders: false,  // Menonaktifkan header X-RateLimit-*
});

export default apiLimiter;
