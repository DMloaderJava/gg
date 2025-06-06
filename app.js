// app.js

// Импортируем нужные модули из Firebase CDN
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js';
import { getAI, getGenerativeModel } from 'https://www.gstatic.com/firebasejs/11.8.0/firebase-ai.js';


// === 1. Получаем ссылки на DOM-элементы ===

// Поля для ввода конфигурации Firebase
const apiKeyInput            = document.getElementById('apiKey');
const authDomainInput        = document.getElementById('authDomain');
const projectIdInput         = document.getElementById('projectId');
const storageBucketInput     = document.getElementById('storageBucket');
const messagingSenderIdInput = document.getElementById('messagingSenderId');
const appIdInput             = document.getElementById('appId');
const measurementIdInput     = document.getElementById('measurementId');

// Кнопка и статус инициализации Firebase
const initBtn    = document.getElementById('init-firebase-btn');
const initStatus = document.getElementById('init-status');

// Секция с AI (изначально скрыта)
const aiSection  = document.getElementById('ai-section');

// Поля для генерации текста
const userInput  = document.getElementById('user-input');
const genBtn     = document.getElementById('generate-btn');
const genStatus  = document.getElementById('gen-status');
const responseEl = document.getElementById('model-response');


// === 2. Переменные для хранения экземпляров ===
let firebaseApp = null;
let aiModel     = null;


// === 3. Валидация обязательных полей ===
function checkRequiredFields() {
  // Проверяем, что все обязательные поля не пустые
  if (
    apiKeyInput.value.trim()            !== '' &&
    authDomainInput.value.trim()        !== '' &&
    projectIdInput.value.trim()         !== '' &&
    storageBucketInput.value.trim()     !== '' &&
    messagingSenderIdInput.value.trim() !== '' &&
    appIdInput.value.trim()             !== ''
  ) {
    initBtn.disabled = false;
  } else {
    initBtn.disabled = true;
  }
}

// Вешаем слушатели на обязательные поля, чтобы динамически включать/выключать кнопку
[
  apiKeyInput,
  authDomainInput,
  projectIdInput,
  storageBucketInput,
  messagingSenderIdInput,
  appIdInput
].forEach(input => {
  input.addEventListener('input', checkRequiredFields);
});


// === 4. Обработчик инициализации Firebase ===
initBtn.addEventListener('click', () => {
  // Собираем объект для firebaseConfig из полей
  const config = {
    apiKey:            apiKeyInput.value.trim(),
    authDomain:        authDomainInput.value.trim(),
    projectId:         projectIdInput.value.trim(),
    storageBucket:     storageBucketInput.value.trim(),
    messagingSenderId: messagingSenderIdInput.value.trim(),
    appId:             appIdInput.value.trim(),
  };

  // measurementId — опционально
  const measId = measurementIdInput.value.trim();
  if (measId !== '') {
    config.measurementId = measId;
  }

  try {
    // Пытаемся инициализировать Firebase
    firebaseApp = initializeApp(config);
    // Сохраняем в глобальную переменную, чтобы при необходимости иметь доступ
    window.__FIREBASE_APP = firebaseApp;

    initStatus.textContent = 'Firebase успешно инициализирован ✅';
    initStatus.classList.remove('error');

    // Блокируем поля конфигурации
    disableConfigInputs();

    // Показываем секцию с AI
    aiSection.style.display = 'block';

    // Настраиваем AI-модель
    setupAIModel();
  } catch (err) {
    console.error('Ошибка инициализации Firebase:', err);
    initStatus.textContent = 'Ошибка инициализации: ' + err.message;
    initStatus.classList.add('error');
  }
});

// Функция блокировки всех полей конфигурации после успешной инициализации
function disableConfigInputs() {
  [
    apiKeyInput,
    authDomainInput,
    projectIdInput,
    storageBucketInput,
    messagingSenderIdInput,
    appIdInput,
    measurementIdInput
  ].forEach(input => {
    input.disabled = true;
  });
}


// === 5. Настройка Generative Model после инициализации Firebase ===
function setupAIModel() {
  // Убеждаемся, что firebaseApp уже создан
  if (!firebaseApp) {
    console.error('FirebaseApp не инициализирован.');
    return;
  }

  const ai = getAI(firebaseApp);
  aiModel = getGenerativeModel(ai, {
    model: 'gemini-2.5-pro-preview-06-05',
    generationConfig: {
      responseMimeType: 'text/plain',
      // можно добавить: maxOutputTokens, temperature, topP и т.д.
    },
  });
}


// === 6. Обработчик «Сгенерировать ответ» ===
genBtn.addEventListener('click', async () => {
  const prompt = userInput.value.trim();
  if (prompt === '') {
    alert('Введите, пожалуйста, текст запроса.');
    return;
  }

  // Блокируем кнопку и показываем статус ожидания
  genBtn.disabled = true;
  genStatus.textContent = 'Ждём ответ от модели…';
  genStatus.classList.remove('error');
  responseEl.textContent = '';

  try {
    const chat = aiModel.startChat();
    const message = { role: 'user', parts: [ prompt ] };
    const result = await chat.sendMessage(message);

    const text = result.response.text();
    responseEl.textContent = text;
    genStatus.textContent = 'Ответ получен.';
  } catch (err) {
    console.error('Ошибка при запросе к модели:', err);
    genStatus.textContent = 'Ошибка при запросе: ' + err.message;
    genStatus.classList.add('error');
  } finally {
    genBtn.disabled = false;
  }
});
