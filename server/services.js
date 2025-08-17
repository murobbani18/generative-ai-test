import { GoogleGenAI } from '@google/genai';
import { createClient } from 'redis';
import fs from 'fs';
import multer from 'multer';

let genAI;
let redisClient;
let upload;

export async function initServices() {
  const { GEMINI_API_KEY, REDIS_HOST, REDIS_PORT } = process.env;

  // Inisialisasi GoogleGenAI
  if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    process.exit(1);
  }
  genAI = new GoogleGenAI(GEMINI_API_KEY);

  // Inisialisasi Redis client
  redisClient = createClient({
    url: `redis://${REDIS_HOST}:${REDIS_PORT}`
  });
  redisClient.on('error', err => console.error('Redis Client Error:', err));
  await redisClient.connect();

  // Inisialisasi Multer
  const uploadDir = 'uploads/';
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
  });
  upload = multer({ storage: storage });
}

export { genAI, redisClient, upload };