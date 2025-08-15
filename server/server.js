import { GoogleGenAI } from '@google/genai';
import "dotenv/config";

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const { PORT, GEMINI_API_KEY, FRONTEND_URL } = process.env;

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

// Konfigurasi Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Inisialisasi GoogleGenAI
const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const app = express();

const corsOptions = {
  origin: FRONTEND_URL || 80,
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the server!');
});

const apiRouter = express.Router();
app.use('/v1', apiRouter);

// ===== Endpoint Chat Multimodal =====
apiRouter.post('/chat', upload.single('file'), async (req, res) => {
  try {
    const { text } = req.body;
    const file = req.file;

    if (!text && !file) {
      return res.status(400).send('Provide at least text or file');
    }

    const contents = [];

    if (text) {
      contents.push({ role: "user", parts: [{ text }] });
    }

    if (file) {
      const fileBuffer = fs.readFileSync(file.path);
      const mimeType = file.mimetype;

      contents.push({
        role: "user",
        parts: [{
          inlineData: {
            data: fileBuffer.toString('base64'),
            mimeType
          }
        }]
      });

      fs.unlinkSync(file.path); // hapus file tmp
    }

    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents
    });

    const reply = response.candidates[0].content.parts.map(part => part.text) || [];

    res.status(200).json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error generating chat response' });
  }
});

// Endpoint untuk input teks
apiRouter.post('/generate-text', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).send('No prompt provided');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });
    res.status(200).send(response.output_text);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating text');
  }
});

// Fungsi helper untuk buat konten multimodal
const createMultimodalContent = (prompt, file) => {
  return [
    { role: "user", parts: [{ text: prompt }] },
    { role: "user", parts: [{ 
      inlineData: {
        data: fs.readFileSync(file.path).toString('base64'),
        mimeType: file.mimetype,
      }
    }]}
  ];
};

// Endpoint untuk input gambar
apiRouter.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and image file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createMultimodalContent(prompt, file)
    });
    res.status(200).send(response.output_text);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating content from image');
  } finally {
    fs.unlinkSync(file.path);
  }
});

// Endpoint untuk input dokumen
apiRouter.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and document file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createMultimodalContent(prompt, file)
    });
    res.status(200).send(response.output_text);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Error generating content from document');
  } finally {
    fs.unlinkSync(file.path);
  }
});

// Endpoint untuk input audio
apiRouter.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and audio file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: createMultimodalContent(prompt, file)
    });
    res.status(200).send(response.output_text);
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
