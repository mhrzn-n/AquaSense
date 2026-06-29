// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAS3ewaT8u-n-f5pccaxOh847tAngOxFHc",
  authDomain: "AquaSense.firebaseapp.com",
  projectId: "AquaSense",
  storageBucket: "AquaSense.firebasestorage.app",
  messagingSenderId: "198876776533",
  appId: "1:198876776533:web:cb683d8d7f5b6693d1ecdc",
  measurementId: "G-W300K35HYG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
