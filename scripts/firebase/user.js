import { auth, db, getDocs, collection, storage } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

export default class User {
  #naam;
  #datum;
  #mail;
  #resolveReady;
  #rejectReady;
  ready;

  constructor() {
    this.ready = new Promise((resolve, reject) => {
      this.#resolveReady = resolve;
      this.#rejectReady = reject;
    });

    onAuthStateChanged(auth, async (user) => {
      if (!user || !user.uid) {
        window.location.href = "login.html";
        this.#rejectReady(new Error("Gebruiker niet ingelogd"));
        return;
      }

      this.#naam = user.displayName ?? user.email ?? "Onbekende gebruiker";
      this.#mail = user.email ?? "Geen e-mail";
      const rawDate = new Date(user.metadata.creationTime);
      this.#datum = rawDate.toLocaleDateString("en-EN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      // Hier was het probleem - je moet de Promise resolven!
      this.#resolveReady();
    });
  }

  getNaam() {
    return this.#naam;
  }
  getDatum() {
    return this.#datum;
  }
  getMail() {
    return this.#mail;
  }
}
