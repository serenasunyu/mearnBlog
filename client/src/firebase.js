// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-e1ce4.firebaseapp.com",
  projectId: "mern-blog-e1ce4",
  storageBucket: "mern-blog-e1ce4.appspot.com",
  messagingSenderId: "211325597868",
  appId: "1:211325597868:web:3700655e5699c474130709"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);