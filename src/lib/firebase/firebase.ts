
// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyARo59xd3BABTzyAVhsS8Qqh0bZWbMrP_0",
  authDomain: "coursecompass-v1quy.firebaseapp.com",
  projectId: "coursecompass-v1quy",
  storageBucket: "coursecompass-v1quy.firebasestorage.app",
  messagingSenderId: "7355191873",
  appId: "1:7355191873:web:18c35d0a96f4428f8d6cc0"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
