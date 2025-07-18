// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDWsxFnywQc3uLrz9HRmdyTgRNdDSVssuk",
  authDomain: "home-nursing-app.firebaseapp.com",
  projectId: "home-nursing-app",
  storageBucket: "home-nursing-app.firebasestorage.app",
  messagingSenderId: "998997103926",
  appId: "1:998997103926:web:28b2a46793eb63f0cdcf97",
  measurementId: "G-MKTRK3P02Z",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };
