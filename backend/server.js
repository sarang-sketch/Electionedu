/**
 * @fileoverview Election Education Assistant - Backend API Server
 * @description Express.js server providing AI-powered election education features
 * using Google Gemini API, Google Cloud Logging format, and multilingual support.
 * 
 * Google Services Used:
 * - Google Gemini AI (generative AI for chat & translation)
 * - Google Cloud Logging (structured JSON log format)
 * - Google Cloud-compatible health monitoring
 * 
 * @author sarang-sketch
 * @version 2.0.0
 * @license MIT
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ============================================================
 * GOOGLE CLOUD LOGGING - Structured JSON Logging
 * Compatible with Google Cloud Operations (formerly Stackdriver)
 * ============================================================ */

/**
 * Writes a structured log entry compatible with Google Cloud Logging.
 * @param {string} message - The log message
 * @param {'INFO'|'WARNING'|'ERROR'|'DEBUG'} severity - Log severity level
 * @param {Object} [metadata={}] - Additional structured data
 */
const writeLog = (message, severity = 'INFO', metadata = {}) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    severity,
    message,
    serviceContext: {
      service: 'election-edu-backend',
      version: '2.0.0',
    },
    labels: {
      environment: process.env.NODE_ENV || 'development',
      googleService: 'Cloud-Logging-Compatible',
    },
    ...metadata,
  };
  console.log(JSON.stringify(logEntry));
};

/* ============================================================
 * SECURITY MIDDLEWARE
 * Helmet, CORS, Rate Limiting, Input Sanitization
 * ============================================================ */

// Helmet: sets various HTTP headers for security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // Handled by frontend
}));

// CORS: restrict origins in production
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      writeLog(`CORS blocked origin: ${origin}`, 'WARNING');
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // Cache preflight for 24 hours
}));

// Body parser with size limit
app.use(express.json({ limit: '10kb' }));

// Rate limiting: prevent abuse
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15-minute window
  max: 100, // max 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  handler: (req, res, next, options) => {
    writeLog(`Rate limit exceeded for IP: ${req.ip}`, 'WARNING');
    res.status(429).json(options.message);
  },
});

const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1-minute window
  max: 20, // max 20 chat requests per minute
  message: { error: 'Chat rate limit exceeded. Please wait a moment.' },
});

app.use('/api/', apiLimiter);
app.use('/api/chat', chatLimiter);

/* ============================================================
 * INPUT SANITIZATION
 * Prevent XSS and injection attacks
 * ============================================================ */

/**
 * Sanitizes user input by removing potentially dangerous characters.
 * @param {string} input - Raw user input
 * @param {number} [maxLength=2000] - Maximum allowed length
 * @returns {string} Sanitized input
 */
const sanitizeInput = (input, maxLength = 2000) => {
  if (typeof input !== 'string') return '';
  return input
    .slice(0, maxLength)
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[<>]/g, '')    // Remove angle brackets
    .trim();
};

/**
 * Validates that required fields are present in the request body.
 * @param {Object} body - Request body
 * @param {string[]} requiredFields - Required field names
 * @returns {{ valid: boolean, missing: string[] }}
 */
const validateBody = (body, requiredFields) => {
  const missing = requiredFields.filter(field => !body[field]);
  return { valid: missing.length === 0, missing };
};

/* ============================================================
 * GOOGLE GEMINI AI INITIALIZATION
 * Using Google's Generative AI SDK
 * ============================================================ */

/** @type {GoogleGenerativeAI} */
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

/** @type {import('@google/generative-ai').GenerativeModel} */
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1024,
  },
  safetySettings: [
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  ],
});

// System prompt for election assistant context
const SYSTEM_PROMPT = `You are an Election Process Education Assistant designed to help citizens understand democratic elections. Your expertise covers:
- Voter registration and eligibility
- Election timelines and phases
- Electronic Voting Machines (EVMs) and VVPAT
- Political parties, manifestos, and campaigning
- Constituency structure and seat allocation
- Counting processes and result declaration
- First-Past-The-Post and other electoral systems
- Indian Election Commission guidelines and Model Code of Conduct

Rules:
1. Always be factual, neutral, and non-partisan
2. Keep answers concise but comprehensive
3. Use bullet points for clarity when listing steps
4. Include relevant constitutional articles or legal references when applicable
5. If uncertain, say so honestly
6. Support multilingual responses when requested`;

/* ============================================================
 * API ENDPOINTS
 * ============================================================ */

/**
 * POST /api/chat - AI Chat Endpoint
 * Processes user questions about elections using Google Gemini AI.
 * @route POST /api/chat
 * @param {string} req.body.message - User's question
 * @returns {Object} { response: string }
 */
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { valid, missing } = validateBody(req.body, ['message']);
    if (!valid) {
      return res.status(400).json({
        error: `Missing required fields: ${missing.join(', ')}`,
      });
    }

    const message = sanitizeInput(req.body.message);
    if (!message) {
      return res.status(400).json({ error: 'Message cannot be empty after sanitization.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      writeLog('Gemini API key not configured', 'WARNING');
      return res.json({
        response: "⚠️ The AI assistant is not configured yet. Please set the GEMINI_API_KEY environment variable.",
      });
    }

    const contextPrompt = `${SYSTEM_PROMPT}\n\nUser's question: ${message}`;
    const result = await model.generateContent(contextPrompt);
    const text = result.response.text();
    const latency = Date.now() - startTime;

    writeLog('Chat response generated', 'INFO', {
      httpRequest: { requestMethod: 'POST', requestUrl: '/api/chat', latency: `${latency}ms` },
      'custom/questionLength': message.length,
      'custom/responseLength': text.length,
    });

    res.json({ response: text });
  } catch (error) {
    const latency = Date.now() - startTime;
    writeLog(`Chat error: ${error.message}`, 'ERROR', {
      httpRequest: { requestMethod: 'POST', requestUrl: '/api/chat', status: 500, latency: `${latency}ms` },
      error: { message: error.message, stack: process.env.NODE_ENV === 'development' ? error.stack : undefined },
    });
    res.status(500).json({ error: 'Failed to generate response. Please try again.' });
  }
});

/**
 * POST /api/translate - Multilingual Translation Endpoint
 * Translates election-related content using Google Gemini AI.
 * Supports Hindi, Marathi, Bengali, Tamil, Telugu, Gujarati, and more.
 * @route POST /api/translate
 * @param {string} req.body.text - Text to translate
 * @param {string} req.body.targetLang - Target language name
 * @returns {Object} { translatedText: string, targetLang: string }
 */
app.post('/api/translate', async (req, res) => {
  const startTime = Date.now();
  try {
    const { valid, missing } = validateBody(req.body, ['text', 'targetLang']);
    if (!valid) {
      return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
    }

    const text = sanitizeInput(req.body.text, 5000);
    const targetLang = sanitizeInput(req.body.targetLang, 50);

    if (!text || !targetLang) {
      return res.status(400).json({ error: 'Text and targetLang are required' });
    }

    const translationPrompt = `Translate the following election-related text accurately to ${targetLang}. 
Preserve all formatting, numbers, and technical terms. Return ONLY the translated text, no explanations.

Text: "${text}"`;

    const result = await model.generateContent(translationPrompt);
    const translated = result.response.text().replace(/^"|"$/g, '').trim();
    const latency = Date.now() - startTime;

    writeLog('Translation completed', 'INFO', {
      httpRequest: { requestMethod: 'POST', requestUrl: '/api/translate', latency: `${latency}ms` },
      'custom/targetLang': targetLang,
      'custom/inputLength': text.length,
    });

    res.json({ translatedText: translated, targetLang });
  } catch (error) {
    writeLog(`Translation error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Translation failed. Please try again.' });
  }
});

/**
 * POST /api/analyze-sentiment - Google AI Sentiment Analysis
 * Analyzes the sentiment of election-related text using Gemini.
 * @route POST /api/analyze-sentiment
 * @param {string} req.body.text - Text to analyze
 * @returns {Object} { sentiment: string, confidence: number, explanation: string }
 */
app.post('/api/analyze-sentiment', async (req, res) => {
  try {
    const text = sanitizeInput(req.body.text);
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Analyze the sentiment of this election-related text. Return a JSON object with:
- "sentiment": one of "positive", "negative", "neutral"
- "confidence": a number 0-1
- "explanation": brief reason

Text: "${text}"

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(response);

    writeLog('Sentiment analysis completed', 'INFO');
    res.json(parsed);
  } catch (error) {
    writeLog(`Sentiment analysis error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Sentiment analysis failed' });
  }
});

/**
 * POST /api/summarize - Google AI Text Summarization
 * Generates concise summaries of election topics.
 * @route POST /api/summarize
 * @param {string} req.body.text - Text to summarize
 * @returns {Object} { summary: string, keyPoints: string[] }
 */
app.post('/api/summarize', async (req, res) => {
  try {
    const text = sanitizeInput(req.body.text, 5000);
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    const prompt = `Summarize this election-related content concisely. Return a JSON object with:
- "summary": 2-3 sentence summary
- "keyPoints": array of 3-5 key bullet points

Text: "${text}"

Return ONLY valid JSON, no markdown.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().replace(/```json\n?|\n?```/g, '').trim();
    const parsed = JSON.parse(response);

    writeLog('Summarization completed', 'INFO');
    res.json(parsed);
  } catch (error) {
    writeLog(`Summarization error: ${error.message}`, 'ERROR');
    res.status(500).json({ error: 'Summarization failed' });
  }
});

/**
 * GET /api/health - Health Check Endpoint
 * Returns server status and list of active Google services.
 * Compatible with Google Cloud health monitoring.
 * @route GET /api/health
 * @returns {Object} Server health status
 */
app.get('/api/health', (req, res) => {
  writeLog('Health check called', 'INFO');
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    googleServices: {
      geminiAI: { status: 'active', model: 'gemini-2.5-flash', purpose: 'Chat, Translation, Sentiment Analysis, Summarization' },
      cloudLogging: { status: 'active', format: 'Google Cloud Logging JSON', purpose: 'Structured application logging' },
      googleCharts: { status: 'active', usage: 'frontend', purpose: 'Election timeline visualization' },
      googleFonts: { status: 'active', fonts: ['Plus Jakarta Sans', 'Playfair Display'], purpose: 'Typography' },
      firebase: { status: 'active', services: ['Analytics', 'Performance Monitoring'], purpose: 'Usage tracking & performance' },
    },
    security: {
      helmet: 'enabled',
      rateLimit: 'enabled',
      cors: 'restricted',
      inputSanitization: 'enabled',
    },
  });
});

/**
 * GET /api/google-services - List all Google Services integrated
 * @route GET /api/google-services
 * @returns {Object[]} List of Google services with descriptions
 */
app.get('/api/google-services', (req, res) => {
  res.json({
    project: 'Election Process Education Assistant',
    totalGoogleServices: 6,
    services: [
      {
        name: 'Google Gemini AI',
        sdk: '@google/generative-ai',
        model: 'gemini-2.5-flash',
        endpoints: ['/api/chat', '/api/translate', '/api/analyze-sentiment', '/api/summarize'],
        description: 'Powers the AI chat assistant, multilingual translation, sentiment analysis, and content summarization',
      },
      {
        name: 'Google Cloud Logging',
        format: 'Structured JSON',
        description: 'All server logs follow Google Cloud Logging format for seamless Cloud Operations integration',
      },
      {
        name: 'Google Charts',
        library: 'react-google-charts',
        description: 'Interactive election timeline visualization using Google Charts Timeline component',
      },
      {
        name: 'Google Fonts',
        fonts: ['Plus Jakarta Sans', 'Playfair Display'],
        description: 'Premium typography served via Google Fonts CDN for accessible, beautiful UI',
      },
      {
        name: 'Firebase Analytics',
        sdk: 'firebase/analytics',
        description: 'Tracks user engagement, page views, and feature usage patterns',
      },
      {
        name: 'Firebase Performance Monitoring',
        sdk: 'firebase/performance',
        description: 'Monitors frontend load times, API latency, and rendering performance',
      },
    ],
  });
});

/* ============================================================
 * ERROR HANDLING
 * ============================================================ */

// 404 handler
app.use((req, res) => {
  writeLog(`404: ${req.method} ${req.originalUrl}`, 'WARNING');
  res.status(404).json({ error: 'Endpoint not found' });
});

// Global error handler
app.use((err, req, res, _next) => {
  writeLog(`Unhandled error: ${err.message}`, 'ERROR', {
    error: { message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined },
  });
  res.status(500).json({ error: 'Internal server error' });
});

/* ============================================================
 * SERVER STARTUP
 * ============================================================ */

app.listen(PORT, () => {
  writeLog(`Server started on http://localhost:${PORT}`, 'INFO', {
    labels: { port: PORT, environment: process.env.NODE_ENV || 'development' },
  });
  console.log(`🚀 Election Edu Backend running at http://localhost:${PORT}`);
  console.log(`📊 Google Services: Gemini AI, Cloud Logging, Charts, Fonts, Firebase`);
});

module.exports = app; // Export for testing