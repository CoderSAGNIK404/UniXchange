import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables from root .env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const router = express.Router();

// Initialize Gemini
// Check if key exists to prevent crash
const apiKey = process.env.GEMINI_API_KEY;
let genAI;
let model;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-pro" });
} else {
    console.error("❌ GEMINI_API_KEY is missing in .env file!");
}

// @route   POST /api/chat
// @desc    Chat with Gemini AI
router.post('/', async (req, res) => {
    try {
        if (!apiKey || !model) {
            return res.status(500).json({ message: 'AI service is not configured properly (Missing API Key)' });
        }

        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ message: 'Message is required' });
        }

        const prompt = `You are a helpful AI assistant for UniXchange, a marketplace for university students to buy and sell items like textbooks, electronics, and dorm essentials. 
        
        User: ${message}`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        console.error("Gemini API Error:", err);
        // Return the specific error message to the client for better debugging
        res.status(500).json({
            message: 'Failed to get response from AI',
            error: err.message,
            details: err.toString()
        });
    }
});

export default router;
