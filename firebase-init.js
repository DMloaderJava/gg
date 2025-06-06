// firebase-init.js

// 1. Импортируем нужные модули из пакета firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// 2. Ваши реальные параметры из консоли Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAi8HwOYj596p2172qxVKvVygGAs0b6xlI",
  authDomain: "hikko-4e6b6.firebaseapp.com",
  projectId: "hikko-4e6b6",
  storageBucket: "hikko-4e6b6.firebasestorage.app",
  messagingSenderId: "75091737741",
  appId: "1:75091737741:web:5e263594423029e499f6c4",
  measurementId: "G-SGWEF8K305"
};

// 3. Инициализируем Firebase-приложение
const app = initializeApp(firebaseConfig);

// 4. (Опционально) Инициализируем Analytics, если нужны метрики
//    Если вы не используете Google Analytics, можно опустить эту строку.
const analytics = getAnalytics(app);

// Теперь объект `app` — ваш инициализированный FirebaseApp, и его можно
// передать в любые другие модули (например, для Firestore, Auth, AI и т. д.).
export { app, analytics };
