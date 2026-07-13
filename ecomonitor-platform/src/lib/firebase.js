import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFSIqcnP5U0CMjQZtIS3jK5VTVcHGLPRw",
  authDomain: "client-cc4df.firebaseapp.com",
  projectId: "client-cc4df",
  storageBucket: "client-cc4df.firebasestorage.app",
  messagingSenderId: "600063857476",
  appId: "1:600063857476:web:9abfe8219251f56e67fd11",
  measurementId: "G-MNM99NCKH9"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);