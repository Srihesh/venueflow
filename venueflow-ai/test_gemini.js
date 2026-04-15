import { GoogleGenerativeAI } from "@google/generative-ai";
const key1 = "AIzaSyCPMoqmziogZk1LQ_ZfhJe59LKlPFwm_sl";
const key2 = "AIzaSyAMuBAMvx0ruB_no7IU3_5or9DN10d_cuk";

async function testKey(keyName, key) {
  try {
    const genAI = new GoogleGenerativeAI(key);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hello");
    console.log(keyName + " works!");
  } catch(e) {
    console.log(keyName + " failed: " + e.message);
  }
}
async function run() {
  await testKey("gemini.js key", key1);
  await testKey("firebase config key", key2);
}
run();
