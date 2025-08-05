import { auth, signOutUser } from "../firebase/firebase.js";
import GenerateFiles from "../index/generateFiles.js";
import User from "../firebase/user.js";
export default class indexComponent {
  //fields
  #naam;
  #mail;
  #permission = true;
  //constructor
  constructor() {
    this.init();
  }

  async init() {
    console.log("IndexComponent: Starting init...");
    const data = new User();
    try {
      console.log("IndexComponent: Waiting for SetOphaler.ready...");
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout waiting for SetOphaler")),
          10000
        )
      );
      await Promise.race([data.ready, timeoutPromise]);
      console.log("IndexComponent: SetOphaler.ready resolved");

      this.#naam = data.getNaam();
      this.#mail = data.getMail();

      console.log("IndexComponent: Data loaded", {
        naam: this.#naam,
        mail: this.#mail,
      });

      // Roep rendering methodes aan na data laden
      this.toHtml();
    } catch (error) {
      console.error("IndexComponent: Error in init:", error);
    }

    const user = auth.currentUser;
    if (!user) {
      window.location = "login.html";
    }
  }

  toHtml() {
    this.displayPerm();
    this.popupToHtml();
    this.uploadToHtml();
    this.sideBarToHtml();
    new GenerateFiles();
  }

  displayPerm() {
    const verwijderd = document.getElementById("verwijderd-treeitem");
    const add = document.getElementById("add-item");
    const bin = document.getElementById("bin");

    if (!this.#permission) {
      verwijderd.style.display = "none";
      add.style.display = "none";
      bin.style.display = "none";
    }
  }

  popupToHtml() {
    const btn = document.getElementById("profile-picture");
    const popup = document.getElementById("popup");
    const naam = document.getElementById("naam-popup");
    const mail = document.getElementById("email-popup");
    const init = document.getElementById("profile-initials");
    const logOut = document.getElementById("log-out");

    naam.innerText = this.#mail
      .split("@")[0]
      .split(".")
      .map((woord) => woord.charAt(0).toUpperCase() + woord.slice(1))
      .join(" ");

    mail.innerText = this.#mail;
    init.innerText = this.#mail
      .split("@")[0]
      .split(".")
      .map((woord) => woord.split("")[0])
      .join("")
      .toUpperCase();

    btn.addEventListener("click", (e) => {
      popup.classList.toggle("show");
    });

    // Sluit popup als je ergens anders op de pagina klikt
    document.addEventListener("click", (e) => {
      if (popup.classList.contains("show")) {
        const isClickInsidePopup = popup.contains(e.target);
        const isClickOnButton = btn.contains(e.target);

        if (!isClickInsidePopup && !isClickOnButton) {
          popup.classList.remove("show");
        }
      }
    });
    logOut.onclick = () => {
      signOutUser();
    };
  }

  uploadToHtml() {}

  sideBarToHtml() {
    const recent = document.getElementById("tab-recent");
    const bladeren = document.getElementById("tab-bladeren");
    const verwijderd = document.getElementById("tab-verwijderd");

    const recTab = document.getElementById("tab-recent-content");
    const blaTab = document.getElementById("tab-bladeren-content");
    const verTab = document.getElementById("tab-verwijderd-content");

    recent.onclick = () => {
      recTab.style.display = "flex";
      blaTab.style.display = "none";
      verTab.style.display = "none";
    };
    bladeren.onclick = () => {
      recTab.style.display = "none";
      blaTab.style.display = "flex";
      verTab.style.display = "none";
    };
    verwijderd.onclick = () => {
      recTab.style.display = "none";
      blaTab.style.display = "none";
      verTab.style.display = "flex";
    };
  }
}
