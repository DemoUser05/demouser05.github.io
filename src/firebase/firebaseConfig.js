// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDTjvujO8BYw8z6GdGT5bERO2Ro7NdYnc",
  authDomain: "space-expedition.firebaseapp.com",
  projectId: "space-expedition",
  storageBucket: "space-expedition.firebasestorage.app",
  messagingSenderId: "943675894249",
  appId: "1:943675894249:web:ada0b816d8e486720e8378",
  measurementId: "G-8P52TWBY0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Ініціалізація Firestore
export { auth, db };