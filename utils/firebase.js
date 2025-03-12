import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD7NnUj2Uh6QFfc7Wskv2DinZt1XBvE92c",
    authDomain: "canaan-pet-resort.firebaseapp.com",
    projectId: "canaan-pet-resort",
    storageBucket: "canaan-pet-resort.firebasestorage.app",
    messagingSenderId: "1014250771740",
    appId: "1:1014250771740:web:74ca76f80e6409ba8256d9",
    measurementId: "G-KS251HNCGM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.useDeviceLanguage(); // Auto-detect user's language

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
