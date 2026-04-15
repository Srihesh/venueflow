import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "API_KEY_HERE";
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
