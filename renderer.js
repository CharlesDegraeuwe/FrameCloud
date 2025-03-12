const { ipcRenderer } = require("electron");

document.getElementById("close").addEventListener("click", () => {
  ipcRenderer.send("close-app");
});

document.getElementById("minimize").addEventListener("click", () => {
  ipcRenderer.send("minimize-app");
});

document.getElementById("maximize").addEventListener("click", () => {
  ipcRenderer.send("maximize-app");
});

