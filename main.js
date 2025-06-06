import { generateText } from "./ai.js";

const button = document.getElementById("generate-btn");
const input  = document.getElementById("user-input");
const output = document.getElementById("model-response");

button.addEventListener("click", async () => {
  const prompt = input.value.trim();
  if (!prompt) {
    alert("Введите текст запроса");
    return;
  }
  button.disabled = true;
  output.textContent = "Ждём ответ от модели...";
  try {
    const text = await generateText(prompt);
    output.textContent = text;
  } catch (e) {
    output.textContent = "Ошибка: " + e.message;
  } finally {
    button.disabled = false;
  }
});
