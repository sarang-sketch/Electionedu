const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Secure logging without vulnerable packages
const writeLog = async (message, severity = 'INFO') => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    severity,
    message,
    service: 'election-edu-backend',
    googleService: 'Cloud-Logging-Compatible'
  };
  console.log(JSON.stringify(logEntry));
};

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.json({ 
        response: "Hello! I am the Election Assistant. (Note: Please add a real Gemini API key.)" 
      });
    }
    const contextPrompt = `You are an Election Process Education Assistant. Your goal is to help users understand the election process, timelines, and steps in an easy-to-follow and engaging way. Answer questions factually and neutrally about voting, registration, campaigns, and government. Keep answers concise. User's question: ${message}`;
    const result = await model.generateContent(contextPrompt);
    const text = result.response.text();
    await writeLog(`User asked: ${message} | Response length: ${text.length}`);
    res.json({ response: text });
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    res.status(500).json({ error: "Failed to generate response." });
  }
});

// Google Translate via Gemini
app.post('/api/translate', async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and targetLang are required' });
    }
    await writeLog(`Translation requested to: ${targetLang}`);
    const translationPrompt = `Translate this election-related text to ${targetLang}. Return only the translated text: "${text}"`;
    const result = await model.generateContent(translationPrompt);
    const translated = result.response.text();
    res.json({ translatedText: translated, targetLang });
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  await writeLog('Health check called', 'INFO');
  res.json({ 
    status: 'OK', 
    googleServices: ['Gemini API', 'Google Charts', 'Google Translate via Gemini'] 
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});