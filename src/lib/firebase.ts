// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  "projectId": "clixcopylaser-cotizaciones",
  "appId": "1:108925873647:web:799ee009c1e2ba72eb5a1a",
  "storageBucket": "clixcopylaser-cotizaciones.firebasestorage.app",
  "apiKey": "AIzaSyCG3lGAZbuez96iyGS0a7Hc_JMh6X1yivE",
  "authDomain": "clixcopylaser-cotizaciones.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "108925873647"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
