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

async function register(e) {
  // Voorkom form submission
  if (e) {
    e.preventDefault();
    console.log("Register form submission voorkomen");
  }

  const email = document.getElementById("email")?.value;
  const name = document.getElementById("name")?.value;
  const password = document.getElementById("password")?.value;

  if (!email || !password || !name || name.trim() === "") {
    alert("Vul alle vereiste velden in.");
    return;
  }

  if (!auth || !db) {
    alert(
      "Authenticatie of database niet geïnitialiseerd. Probeer het later opnieuw."
    );
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update displayName in Auth profiel
    try {
      await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error("Fout bij het updaten van profiel:", error);
      alert("Fout bij het instellen van de naam. Account is wel aangemaakt.");
    }

    // Voer Firestore transaction uit om teller te verhogen en profiel aan te maken
    try {
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, "meta", "counters");
        const counterDoc = await transaction.get(counterRef);

        let currentCount = 0;
        if (counterDoc.exists()) {
          currentCount = counterDoc.data().userCount || 0;
        } else {
          transaction.set(counterRef, { userCount: 0 });
        }

        const newCount = currentCount + 1;
        transaction.update(counterRef, { userCount: newCount });

        const userRef = doc(db, "users", user.uid);
        transaction.set(userRef, {
          email: user.email,
          displayName: name,
          tijdOpSite: 0, // Tijd doorgebracht op de site
          tijdInGames: 0, // Tijd doorgebracht in games
          kaartenGestudeerd: 0, // Aantal kaarten gestudeerd
          joinNumber: newCount, // Volgnummer van de gebruiker
          laatsteLoginDatum: null, // Laatste login datum voor streak
          streakScore: 0, // Streak score
          createdAt: serverTimestamp(),
        });
      });

      alert("Account aangemaakt! Je wordt automatisch ingelogd...");

      // Automatisch inloggen na registratie (gebruiker is al ingelogd door createUserWithEmailAndPassword)
      console.log("Gebruiker automatisch ingelogd na registratie:", user);

      // Kleine delay voor gebruikerservaring
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1500);
    } catch (error) {
      console.error("Fout bij Firestore-transactie:", error);
      alert("Probeer opnieuw.");
    }
  } catch (error) {
    console.error("Fout bij registreren:", error.code, error.message);
    alert(error.message);
  }
}

//buttons laten werken
document.addEventListener("DOMContentLoaded", () => {
  const registerBtn = document.getElementById("enter-button");
  if (registerBtn) {
    registerBtn.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("Register knop geklikt");
      register(e);
    });
  } else {
    console.warn("Registratieknop niet gevonden");
  }
  const threedots = document.getElementById("three-dots-wrapper");
  const popup = document.getElementById("popup");
  threedots.onclick = () => {
    popup.classList.toggle("show");
  };

  document.addEventListener("click", (e) => {
    if (popup.classList.contains("show")) {
      const isClickInsidePopup = popup.contains(e.target);
      const isClickOnButton = threedots.contains(e.target);

      if (!isClickInsidePopup && !isClickOnButton) {
        popup.classList.remove("show");
      }
    }
  });
  const overlay = document.getElementById("popupOverlay");
  const probleem = document.getElementById("probleem");
  probleem.onclick = () => {
    overlay.style.display = "flex";
    popup.classList.remove("animate__fadeOutUp");
    popup.classList.add("animate__fadeInDown");
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closePopup();
    }
  });

  function closePopup() {
    const overlay = document.getElementById("popupOverlay");
    const popup = document.getElementById("popupContent");

    overlay.style.display = "none";
  }
});

function alert(message) {
  const alert = document.getElementById("error-container");
  if (!alert) {
    console.error("Alert elementen niet gevonden");
    alert(message);
    return;
  }

  let bericht;

  switch (message) {
    case "Firebase: Error (auth/email-already-in-use).":
      bericht = "Email al in gebruik";
      break;

    case "Firebase: Password should be at least 6 characters (auth/weak-password).":
      bericht = "Wachtwoord moet minstens 6 tekens zijn";
      break;

    default:
      bericht = message;
  }

  alert.innerText = bericht;
  alert.classList.add("show");

  setTimeout(() => {
    alert.classList.remove("show");
    alert.innerText = "";
  }, 5000);
}
