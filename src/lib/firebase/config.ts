// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
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

// Dynamically authorize the domain in development/preview
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    auth.tenantId = null;
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    const port = window.location.port;
    try {
        connectAuthEmulator(auth, `${protocol}//${host}:${port}`, { disableWarnings: true });
    } catch (e) {
        // This can sometimes fail on hot reloads, but it's fine to ignore
        // console.warn('Auth emulator connection failed:', e);
    }
}


export { app, auth };
