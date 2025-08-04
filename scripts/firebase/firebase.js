import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  setLogLevel,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

// Enable Firestore debug logging only in development
// setLogLevel("debug");

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2r9NZYd3rTFQbMILdiOohVUR_z4doNHk",
  authDomain: "framecloud-160f6.firebaseapp.com",
  projectId: "framecloud-160f6",
  storageBucket: "framecloud-160f6.firebasestorage.app",
  messagingSenderId: "185483395803",
  appId: "1:185483395803:web:9d85ba35b55db522d882fe",
  measurementId: "G-QTYX1FZ1WM",
};

// Initialize Firebase with error handling
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase: Failed to initialize app", error);
  throw error;
}

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

function signOutUser() {
  signOut(auth)
    .then(() => {
      console.log("Firebase: User signed out successfully");
      try {
        localStorage.removeItem("profileImageUrl");
      } catch (e) {
        console.warn("Firebase: Failed to clear localStorage", e.message);
      }
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.error("Firebase: Error signing out:", error);
      alert("Fout bij uitloggen. Probeer opnieuw.");
    });
}

// Debug log to confirm setDoc is imported correctly
console.log("Firebase: setDoc exported", setDoc);

export {
  app,
  db,
  auth,
  storage,
  collection,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
  onAuthStateChanged,
  deleteDoc,
  signOutUser,
  ref,
  deleteObject,
};
