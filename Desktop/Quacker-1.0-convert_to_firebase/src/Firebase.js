// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBpmV7INT9dYaOuMPzhQwtWTQenHn1uu9s",
  authDomain: "quacker-9dd10.firebaseapp.com",
  projectId: "quacker-9dd10",
  storageBucket: "quacker-9dd10.appspot.com",
  messagingSenderId: "634937017104",
  appId: "1:634937017104:web:f0dc346fed9f09d7a91b95",
  measurementId: "G-7DH0JD9FNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();
const storage = getStorage();

export { app, db, storage };