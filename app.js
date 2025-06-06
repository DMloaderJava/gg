// app.js

import { getAI, getGenerativeModel, GenerationConfig, Content } from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-ai.js';

(async () => {
  // Получаем объект FirebaseApp, сохранённый в index.html
  const firebaseApp = window.__FIREBASE_APP;
  if (!firebaseApp) {
    console.error('Firebase не инициализирован. Проверьте index.html.');
    return;
  }

  // Настраиваем модель: текстовый ответ (plain text)
  const generationConfig = /** @type {GenerationConfig} */ ({
    responseMimeType: 'text/plain',
  });

  // Инициализируем AI-сервис и generative-модель
  const ai = getAI(firebaseApp);
  const model = getGenerativeModel(ai, {
    model: 'gemini-2.5-pro-preview-06-05', // Можно заменить на актуальную версию
    generationConfig,
  });

  // Обработчики DOM
  const inputEl = document.getElementById('user-input');
  const btnEl = document.getElementById('generate-btn');
  const outputEl = document.getElementById('model-response');

  btnEl.addEventListener('click', async () => {
    const userText = inputEl.value.trim();
    if (!userText) {
      alert('Введите текст запроса.');
      return;
    }

    // Формируем сообщение пользователем
    const message = /** @type {Content} */ ({
      role: 'user',
      parts: [userText],
    });

    // Запускаем чат-сессию и отправляем запрос
    const chat = model.startChat();
    outputEl.textContent = 'Генерация ответа...';
    try {
      const result = await chat.sendMessage(message);
      // Выводим ответ модели
      outputEl.textContent = result.response.text();
    } catch (err) {
      console.error(err);
      outputEl.textContent = 'Ошибка при запросе к модели: ' + err.message;
    }
  });
})();
