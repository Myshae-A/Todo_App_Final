// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCz-5dfH4vsVYfwFIxKtbRCHAj_FulKKjE",
    authDomain: "todo-app-final-de848.firebaseapp.com",
    projectId: "todo-app-final-de848",
    storageBucket: "todo-app-final-de848.firebasestorage.app",
    messagingSenderId: "425939452656",
    appId: "1:425939452656:web:6437e4e78f1285cd3cf835",
    measurementId: "G-V7M7SWTQHE"
  };

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { firebaseConfig };

export default db;
export const auth = getAuth(app);