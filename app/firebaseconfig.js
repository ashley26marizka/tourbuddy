

// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyCOLtVK9GTLqxTf4StBrm3bksbQ2mPomWc",
    authDomain: "tourbuddy-3890b.firebaseapp.com",
    projectId: "tourbuddy-3890b",
    storageBucket: "tourbuddy-3890b.appspot.com",
    messagingSenderId: "512103263500",
    appId: "1:512103263500:web:707315c48308a60f216d29",
    measurementId: "G-3ZSP4QY6S2"
  };
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };