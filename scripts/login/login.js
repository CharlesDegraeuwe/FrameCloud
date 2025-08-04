import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  increment,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2r9NZYd3rTFQbMILdiOohVUR_z4doNHk",
  authDomain: "framecloud-160f6.firebaseapp.com",
  projectId: "framecloud-160f6",
  storageBucket: "framecloud-160f6.firebasestorage.app",
  messagingSenderId: "185483395803",
  appId: "1:185483395803:web:9d85ba35b55db522d882fe",
  measurementId: "G-QTYX1FZ1WM",
};

let app, auth, provider, db;

console.log("Script geladen:", new Date().toISOString());

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  auth.languageCode = "en";
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
  console.log("Firebase succesvol geïnitialiseerd");
} catch (error) {
  console.error("Fout bij Firebase-initialisatie:", error);
}

function login(e) {
  // Voorkom form submission
  if (e) {
    e.preventDefault();
    console.log("Login form submission voorkomen");
  }

  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  // Lege velden checken
  if (!email || !password) {
    alert("Vul alle vereiste velden in.");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("Succesvol ingelogd:", userCredential.user);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 300);
    })
    .catch((error) => {
      console.error("Fout bij inloggen:", error.code, error.message);

      // Specifieke foutmeldingen tonen
      switch (error.code) {
        case "auth/invalid-email":
          alert("Ongeldig e-mailadres.");
          break;
        case "auth/user-not-found":
          alert("Geen gebruiker gevonden met dit e-mailadres.");
          break;
        case "auth/wrong-password":
          alert("Incorrect wachtwoord.");
          break;
        case "auth/too-many-requests":
          alert("Te veel mislukte pogingen. Probeer later opnieuw.");
          break;
        default:
          alert("Er is een fout opgetreden bij het inloggen.");
      }
    });
}

//buttons laten werken
document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("enter-button");
  if (loginBtn) {
    loginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Login knop geklikt");
      login(e);
    });
  } else {
    console.warn("Inlogknop niet gevonden");
  }
});

function alert(message) {
  const alert = document.getElementById("error-container");
  if (!alert) {
    console.error("Alert elementen niet gevonden");
    alert(message);
    return;
  }

  alert.innerText = message;
  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show");
    alert.innerText = "";
  }, 5000);
}
