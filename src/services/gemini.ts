// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const geminiApiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(geminiApiKey);

// Using flash-latest for stability and auto-resolution
export const geminiModel = genAI.getGenerativeModel({ 
  model: 'gemini-flash-latest'
});

export const fetchGeminiResponse = async (prompt: string) => {
  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    // Clean potential markdown backticks
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};
