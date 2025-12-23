import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/functions";

// =================================================================
// TODO: REPLACE WITH YOUR FIREBASE PROJECT CONFIGURATION
// =================================================================
// You can get these details from the Firebase console:
// Project Settings > General > Your apps > Web app > SDK setup and configuration
const firebaseConfig = {
  apiKey: "AIzaSyAqrgayAtKZkbx30M-fNE2s7J7QTMC85aM",
  authDomain: "choco-6155c.firebaseapp.com",
  projectId: "choco-6155c",
  storageBucket: "choco-6155c.firebasestorage.app",
  messagingSenderId: "189617510511",
  appId: "1:189617510511:web:cc54a9c1466917393ed59a",
  measurementId: "G-62FT209Y8D"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();
const functions = firebase.functions();

export { auth, db, functions };