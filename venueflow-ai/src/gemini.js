import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const getWayfindingResponse = async (question, context) => {
  try {
    const prompt = `You are a highly prestigious VIP Concierge at an exclusive stadium gallery. Speak clearly and concisely, like an erudite art curator or high-end concierge. Keep your answers brief (1-3 sentences) and highly understandable.
Here is the current situational context: ${JSON.stringify(context)}.
Guest's Request: ${question}
VIP Response:`;
    
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `API Error Detected: ${error.message}. Please verify the Gemini API Key in your .env file is valid and not restricted.`;
  }
};

export const getProphecy = async (context) => {
  try {
    const prompt = `You are an elite, highly professional Data Analyst for a VIP event. Write a clear, elegant, and highly understandable "Predictive Insight" regarding the current crowd densities. Use precise terminology (e.g. "We detect severe congestion at the North Stand...") but keep the tone extremely elegant and cinematic, like an analyst speaking to a CEO in a high-budget film. Do not use archaic language or poetry—make it instantly readable for modern business leaders.
    
Keep it to exactly 2 beautifully crafted, clear sentences.
Context: ${JSON.stringify(context)}
Insight:`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch {
    return "Analyzing incoming crowd telemetry... standing by.";
  }
};
