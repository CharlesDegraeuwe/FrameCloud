const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");

// Voorkom standaard gedrag bij drag & drop
["dragenter", "dragover", "dragleave", "drop"].forEach((event) => {
  dropArea.addEventListener(event, (e) => e.preventDefault());
});

// Highlight wanneer bestand wordt gesleept
["dragenter", "dragover"].forEach((event) => {
  dropArea.addEventListener(event, () => dropArea.classList.add("dragover"));
});

["dragleave", "drop"].forEach((event) => {
  dropArea.addEventListener(event, () => dropArea.classList.remove("dragover"));
});

// Bestand laten vallen
dropArea.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// Klik om bestanden te kiezen
dropArea.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", () => handleFiles(fileInput.files));

// Bestand verwerken (voor nu alleen loggen)
function handleFiles(files) {
  [...files].forEach((file) => console.log("Bestand geselecteerd:", file.name));
}
