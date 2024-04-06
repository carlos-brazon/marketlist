import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Configuración Firebase 1
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
};

const app1 = initializeApp(firebaseConfig);
export const db = getFirestore(app1);
export const auth = getAuth(app1);

// Configuración Firebase 2
const firebaseConfig2 = {
  apiKey: import.meta.env.VITE_API_KEY2,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN2,
  projectId: import.meta.env.VITE_PROJECT_ID2,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET2,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID2,
  appId: import.meta.env.VITE_APP_ID2,
};
const app2 = initializeApp(firebaseConfig2, "app2");
export const db2 = getFirestore(app2);
export const auth2 = getAuth(app2);
