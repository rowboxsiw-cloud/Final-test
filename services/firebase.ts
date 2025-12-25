
import { initializeApp } from "firebase/app";
// Modular imports for Firebase v9+
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getDatabase, ref, get, set, update, onValue, push, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyC-t_vB6OujhQfAHuMoC9VgybEIl8IaAsA",
  authDomain: "whatsapp-like-app-cabcf.firebaseapp.com",
  databaseURL: "https://whatsapp-like-app-cabcf-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "whatsapp-like-app-cabcf",
  storageBucket: "whatsapp-like-app-cabcf.firebasestorage.app",
  messagingSenderId: "427607724769",
  appId: "1:427607724769:web:982a7d4a24d329c0ca1da0"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Auth Error:", error);
    throw error;
  }
};

export const logout = () => signOut(auth);
