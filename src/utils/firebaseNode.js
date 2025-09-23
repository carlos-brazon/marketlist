//firebaseNode.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
//menuraiz/src/utils/firebase<node.js
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";

dotenv.config(); // carga variables del .env

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
