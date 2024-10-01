// src/firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Add Firestore import
import { getAnalytics } from "firebase/analytics";
import firebaseConfig from './firebaseConfig'; // Import the config

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app); // Add Firestore initialization

export { db, analytics }; // Export Firestore (db) for use in your scripts
