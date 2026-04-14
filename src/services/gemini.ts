// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Using flash-latest for stability and auto-resolution
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });