// ai.js
import { app } from "./firebase-init.js";                  // ваш инициализированный FirebaseApp
import { getAI, getGenerativeModel } from "firebase/ai";   // либо из CDN, если вы работаете в браузере без bundler'a

// Пример настроек модели Gemini
const ai = getAI(app);
const aiModel = getGenerativeModel(ai, {
  model: "gemini-2.5-pro-preview-06-05",
  generationConfig: {
    responseMimeType: "text/plain",
    // ... другие опции при необходимости
  },
});

export async function generateText(prompt) {
  const chat = aiModel.startChat();
  const result = await chat.sendMessage(prompt);
  return result.response.text();
}
