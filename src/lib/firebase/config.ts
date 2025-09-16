// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADupjERlFxAEx-fgmyCaNq97Q9j3kWJRI",
  authDomain: "marketplacetrustedvehicles.firebaseapp.com",
  projectId: "marketplacetrustedvehicles",
  storageBucket: "marketplacetrustedvehicles.firebasestorage.app",
  messagingSenderId: "1096583469439",
  appId: "1:1096583469439:web:3600a7a69b3122d1cd224a",
  measurementId: "G-5671SNRK8G"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

// Dynamically authorize the development domain
if (typeof window !== 'undefined' && !window.location.hostname.includes('firebaseapp.com')) {
    auth.config.authDomain = window.location.hostname;
}

export { app, auth };
