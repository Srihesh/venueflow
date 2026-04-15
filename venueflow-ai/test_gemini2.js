import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "API_KEY_HERE";
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
