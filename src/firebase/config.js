// Import Firebase core and needed services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

// Export Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
