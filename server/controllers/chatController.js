import fs from 'fs';
import genAI from '../services/geminiService.js';
import redisClient from '../services/redisService.js';
import { randomUUID } from "crypto";

/**
 * Helper untuk bikin konten multimodal (prompt + file)
 */
const createMultimodalContent = (prompt, file) => [
  { role: "user", parts: [{ text: prompt }] },
  { role: "user", parts: [{
    inlineData: {
      data: fs.readFileSync(file.path).toString('base64'),
      mimeType: file.mimetype,
    }
  }]}
];

/**
 * Endpoint: Chat multimodal (dengan session & redis)
 */
export const chatHandler = async (req, res) => {
  try {
    // Ambil dari middleware (pasti sudah ada)
    const sessionId = req.sessionId;  

    const { text } = req.body;
    const file = req.file;

    console.log("memuat history dari redis dengan sessionId:", sessionId);
    const historyString = await redisClient.get(sessionId);
    let chatHistory = [];
    if (historyString) {
      try {
        chatHistory = JSON.parse(historyString);
      } catch (err) {
        console.error("Redis data corrupted:", err);
        chatHistory = [];
      }
    }
    
    console.log("chatHistory:", chatHistory);

    if (text) {
      chatHistory.push({ role: "user", parts: [{ text }] });
    }

    if (file) {
      chatHistory.push({
        role: "user",
        parts: [
          {
            inlineData: {
              data: fs.readFileSync(file.path).toString("base64"),
              mimeType: file.mimetype,
            },
          },
        ],
      });
      fs.unlinkSync(file.path);
    }

    const recentHistory = chatHistory.slice(-20);


    // panggil Gemini API
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: recentHistory,
    });

    console.log("response dari Gemini:", JSON.stringify(response))
    const reply = response.text;
    chatHistory.push({ role: "model", parts: [{ text: reply }] });

    console.log("save to redis: ", sessionId, JSON.stringify(chatHistory));
    // simpan ke Redis
    await redisClient.set(sessionId, JSON.stringify(chatHistory));

    res.status(200).json({ reply });
  } catch (err) {
    console.error("❌ ChatHandler Error:", err);
    res.status(500).json({ error: "Error generating chat response" });
  }
};

/**
 * Endpoint: Generate Text
 */
export const generateTextHandler = async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) return res.status(400).send('No prompt provided');

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    res.status(200).send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating text');
  }
};

/**
 * Endpoint: Generate dari Image
 */
export const generateFromImageHandler = async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and image file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: createMultimodalContent(prompt, file)
    });

    res.status(200).send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content from image');
  } finally {
    fs.unlinkSync(file.path);
  }
};

/**
 * Endpoint: Generate dari Document
 */
export const generateFromDocumentHandler = async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and document file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: createMultimodalContent(prompt, file)
    });

    res.status(200).send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content from document');
  } finally {
    fs.unlinkSync(file.path);
  }
};

/**
 * Endpoint: Generate dari Audio
 */
export const generateFromAudioHandler = async (req, res) => {
  const { prompt } = req.body;
  const file = req.file;

  if (!prompt || !file) {
    if (file) fs.unlinkSync(file.path);
    return res.status(400).send('Prompt and audio file are required');
  }

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: createMultimodalContent(prompt, file)
    });

    res.status(200).send(response.text);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating content from audio');
  } finally {
    fs.unlinkSync(file.path);
  }
};
