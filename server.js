import { GoogleGenerativeAI } from '@google/generative-ai';
import "dotenv/config";

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const { PORT, GEMINI_API_KEY } = process.env;

// Pastikan API key ada
if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in the .env file.");
  process.exit(1);
}

// Pastikan direktori 'uploads' ada
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi Multer untuk menangani file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });



// Inisialisasi GoogleGenerativeAI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

// Endpoint untuk input teks saja
app.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('No prompt provided');
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    res.status(200).send(result.response.text());
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating text');
  }
});

// Endpoint untuk input gambar
app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    // Hapus file jika ada, karena permintaan tidak valid
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and image file are required');
  }

  try {
    const imagePart = {
      inlineData: {
        data: fs.readFileSync(file.path).toString('base64'),
        mimeType: file.mimetype,
      }
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt, imagePart]);
    res.status(200).send(result.response.text());
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating content from image');
  } finally {
    // Pastikan file dihapus setelah diproses
    fs.unlinkSync(file.path);
  }
});

// Endpoint untuk input dokumen
app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and document file are required');
  }

  try {
    const documentPart = {
      inlineData: {
        data: fs.readFileSync(file.path).toString('base64'),
        mimeType: file.mimetype,
      }
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt, documentPart]);
    res.status(200).send(result.response.text());
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating content from document');
  } finally {
    fs.unlinkSync(file.path);
  }
});

// Endpoint untuk input audio
app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and audio file are required');
  }

  try {
    const audioPart = {
      inlineData: {
        data: fs.readFileSync(file.path).toString('base64'),
        mimeType: file.mimetype,
      }
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent([prompt, audioPart]);
    res.status(200).send(result.response.text());
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating content from audio');
  } finally {
    fs.unlinkSync(file.path);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
