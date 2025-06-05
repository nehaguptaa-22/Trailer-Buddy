// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBm_xvAa6-9HLOdG-v2s1zSKEu3mgOvHeA",
  authDomain: "movie-playlist-app.firebaseapp.com",
  databaseURL: "https://movie-playlist-app-default-rtdb.firebaseio.com/",  // Added Realtime DB URL
  projectId: "movie-playlist-app",
  storageBucket: "movie-playlist-app.appspot.com",  // Fixed storage bucket typo here
  messagingSenderId: "784803447738",
  appId: "1:784803447738:web:679293ed24a006944ad383",
  measurementId: "G-STFBLYBHFE"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const database = getDatabase(app);
