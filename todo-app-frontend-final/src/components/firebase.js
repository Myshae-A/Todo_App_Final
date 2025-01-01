// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMRBEA8z7ME-SD8ZJSxXBre2yaSM1Tobs",
    authDomain: "todo-app-wk7.firebaseapp.com",
    projectId: "todo-app-wk7",
    storageBucket: "todo-app-wk7.firebasestorage.app",
    messagingSenderId: "706831287109",
    appId: "1:706831287109:web:0a2f91e5701f9ec79e342c",
    measurementId: "G-MVXLPPEEL3"
};

// Initialize Firebase Client SDK
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { firebaseConfig };

export default db;
export const auth = getAuth(app);