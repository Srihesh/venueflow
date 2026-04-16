import { GoogleGenerativeAI } from "@google/generative-ai";
// Load from .env file when running locally: GEMINI_API_KEY=your_key node test_models.js
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY environment variable");
const genAI = new GoogleGenerativeAI(API_KEY);

const models = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite-001",
  "gemini-flash-latest",
  "gemini-2.5-pro"
];

async function run() {
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      await model.generateContent("hello");
      console.log(m + " = WORKS PERFECTLY!");
    } catch (e) {
      console.log(m + " = FAILED: " + e.message);
    }
  }
}
run();
