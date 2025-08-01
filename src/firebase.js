// src/firebase/config.js

// Import Firebase core and needed services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ أضفنا storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_21mju5TVqyQt8aBTJKF2iLjVDCCn0D8",
  authDomain: "carevio-61abd.firebaseapp.com",
  projectId: "carevio-61abd",
  storageBucket: "carevio-61abd.appspot.com",
  messagingSenderId: "732378027185",
  appId: "1:732378027185:web:8e3568d544e38648903e90",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ تهيئة storage

// Export them to use in your components
export { auth, db, storage };
