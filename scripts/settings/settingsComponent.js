import { auth, signOutUser } from "../firebase/firebase.js";
import User from "../firebase/user.js";

export default class SettingsComponent {
  //fields
  #naam;
  #mail;
  #data = [];
  #permission = false;
  //constructor
  constructor() {
    this.init();
  }

  async init() {
    const data = new User();
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout waiting for SetOphaler")),
          10000
        )
      );
      await Promise.race([data.ready, timeoutPromise]);

      this.#naam = data.getNaam();
      this.#mail = data.getMail();

      console.log("IndexComponent: Data loaded", {
        naam: this.#naam,
        mail: this.#mail,
      });

      // Roep rendering methodes aan na data laden
      this.toHtml();
    } catch (error) {}

    const user = auth.currentUser;
    if (!user) {
      window.location = "login.html";
    }
  }

  toHtml() {
    this.popupToHtml();
    this.displayName();
    this.startPolling();
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

  displayName() {
    const name = document.getElementById("naam-profiel-dashboard");
    name.innerText = this.#mail
      .split("@")[0]
      .split(".")
      .map((woord) => woord.charAt(0).toUpperCase() + woord.slice(1))
      .join(" ");

    const email = document.getElementById("email-dashboard");
    email.innerText = this.#mail;

    const logOut = document.getElementById("logout-button");
    logOut.onclick = () => {
      signOutUser();
    };
  }

  async displayServerInfo() {
    console.log("data aangeroepen");
    const url = "https://e7e864d54630.ngrok-free.app/status";
    try {
      const response = await fetch(url, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const text = await response.text();
      console.log("Raw response:", text);
      this.#data = JSON.parse(text);
      console.log(this.#data);
    } catch (error) {
      console.error("Error:", error.message);
    }

    const cpUtil = document.getElementById("cpUtil");
    const speed = document.getElementById("speed");
    const cpuTemp = document.getElementById("cpuTemp");

    cpUtil.innerText = this.#data.cpu.utilization.toFixed(1) + " %";
    speed.innerText =
      (Math.floor(this.#data.cpu.speed) / 1000).toFixed(1) + " GHz";
    cpuTemp.innerText = this.#data.cpu.temperature
      .split("")
      .splice(1)
      .join("")
      .replace("C", "");

    const use = document.getElementById("use");
    const available = document.getElementById("available");
    const cached = document.getElementById("cached");

    use.innerText = this.#data.memory.in_use.toFixed(2) + " GB";
    available.innerText = this.#data.memory.available.toFixed(2) + " GB";
    cached.innerText = this.#data.memory.cached.toFixed(2) + " GB";

    const gpUtil = document.getElementById("gpUtil");
    const mem = document.getElementById("memory");
    const gpuTemp = document.getElementById("gpuTemp");
    if (this.#data.gpu.utilization === "N/A") {
      gpUtil.innerText = "N/A";
      mem.innerText = "N/A";
      gpuTemp.innerText = "N/A";
    } else {
      gpUtil.innerText = this.#data.gpu.utilization.toFixed(1) + " %";
      mem.innerText = this.#data.gpu.memory.toFixed(2) + " GB";
      gpuTemp.innerText = this.#data.gpu.temperature
        .split("")
        .splice(1)
        .join("")
        .replace("C", "");
    }
    const send = document.getElementById("send");
    const receive = document.getElementById("receive");

    send.innerText = this.#data.ethernet.sent.toFixed(1) + " MB/s";
    receive.innerText = this.#data.ethernet.received.toFixed(1) + " MB/s";
  }

  startPolling() {
    setInterval(() => this.displayServerInfo(), 500);
  }
}
