import { GoogleGenerativeAI } from "@google/generative-ai";
// Load from .env file when running locally: GEMINI_API_KEY=your_key node test_gemini2.js
const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) throw new Error("Missing GEMINI_API_KEY environment variable");
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    await model.generateContent("hello");
    console.log(modelName + " WORKS!");
  } catch(e) {
    console.log(modelName + " FAILED: " + e.message);
  }
}
async function run() {
  await testModel("gemini-1.5-flash");
  await testModel("gemini-1.5-flash-8b");
  await testModel("gemini-1.5-pro");
  await testModel("gemini-pro");
}
run();
