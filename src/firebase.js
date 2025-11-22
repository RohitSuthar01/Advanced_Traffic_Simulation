import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC9XW0U_ZhmscTXeeUfpztMlRQ4dnuf2Y0",
  authDomain: "trafficlightsim.firebaseapp.com",
  projectId: "trafficlightsim",
  storageBucket: "trafficlightsim.firebasestorage.app",
  messagingSenderId: "43342606859",
  appId: "1:43342606859:web:7b50e371f27c1d98184d0e"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();