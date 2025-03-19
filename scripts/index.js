document.addEventListener("DOMContentLoaded", function () {
  // Make an AJAX request to get user data
  fetch("get_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      function initials(data) {
        if (data.username.indexOf(" ") >= 0) {
          const firstNameInitial = data.username.toUpperCase().substring(0, 1);

          const lastNameInitial = data.username
            .toUpperCase()
            .substring(
              data.username.indexOf(" ") + 1,
              data.username.indexOf(" ") + 2
            );

          return firstNameInitial + lastNameInitial;
        } else {
          return data.username.toUpperCase().substring(0, 1);
        }
      } 

      // Update the HTML elements with the user data
      document.getElementById("naam-popup").textContent = data.username;
      document.getElementById("naam-popup").style.color = "white";
      document.getElementById("naam-popup").style.fontSize = "18px";

      document.getElementById("email-popup").textContent = data.email;
      document.getElementById("profile-initials").textContent = initials(data);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
});
document.getElementById("add-item").addEventListener("click", function () {
  document.getElementById("upload-container").classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
  const fileInput = document.getElementById("file-input");
  const fileList = document.getElementById("file-list");
  const dropArea = document.getElementById("drop-area");
  const uploadBtn = document.getElementById("submit-button");

  let filesArray = [];

  // Functie om de upload-knop in- of uit te schakelen
  function toggleUploadButton() {
    uploadBtn.disabled = filesArray.length === 0; // Schakel uit als er geen bestanden zijn
  }

  // Bestanden weergeven in de lijst
  function updateFileList() {
    fileList.innerHTML = "";
    filesArray.forEach((file, index) => {
      const listItem = document.createElement("ul");
      listItem.textContent = file.name;
      listItem.classList.add("upload-list");

      // Verwijderknop (❌)
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "❌";
      removeBtn.style.marginLeft = "10px";
      removeBtn.style.cursor = "pointer";
      removeBtn.classList.add("remove-btn");

      removeBtn.onclick = function () {
        filesArray.splice(index, 1);
        updateFileList();
        toggleUploadButton(); // Update de upload-knop na verwijderen
      };

      listItem.appendChild(removeBtn);
      fileList.appendChild(listItem);
    });

    // Update de file input met nieuwe FileList
    const dataTransfer = new DataTransfer();
    filesArray.forEach((file) => dataTransfer.items.add(file));
    fileInput.files = dataTransfer.files;

    toggleUploadButton(); // Update de upload-knop na toevoegen
  }

  // Wanneer een bestand wordt geselecteerd
  fileInput.addEventListener("change", function () {
    filesArray = [...fileInput.files];
    updateFileList();
  });

  // Drag-and-drop functionaliteit
  dropArea.addEventListener("dragover", function (event) {
    event.preventDefault();
    dropArea.style.border = "2px dashed #000"; // UI feedback
  });

  dropArea.addEventListener("dragleave", function () {
    dropArea.style.border = "none";
  });

  dropArea.addEventListener("drop", function (event) {
    event.preventDefault();
    dropArea.style.border = "none";

    let droppedFiles = [...event.dataTransfer.files];
    filesArray = filesArray.concat(droppedFiles);
    updateFileList();
  });
});
