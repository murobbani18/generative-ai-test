import { GoogleGenAI } from '@google/genai';

const { GEMINI_API_KEY } = process.env;

if (!GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not set in the .env file.");
  process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

export default genAI;
