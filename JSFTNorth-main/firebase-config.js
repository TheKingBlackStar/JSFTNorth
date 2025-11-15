// Firebase Configuration
// This file centralizes your Firebase setup for the entire site

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAiieziFvCjPRF0XOvDuEEZU0wCU8Fw2XM",
  authDomain: "jstfnorthwebsite.firebaseapp.com",
  projectId: "jstfnorthwebsite",
  storageBucket: "jstfnorthwebsite.firebasestorage.app",
  messagingSenderId: "722655135910",
  appId: "1:722655135910:web:e9a754e9b06c888d754c67",
  measurementId: "G-NG4JDR0RC4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export for use in other files
export { app, auth, db, storage };
