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
document.getElementById("add-item").addEventListener("click", function() {
    document.getElementById("upload-container").classList.toggle("hidden");
});
const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");

dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "#e0f7ff";
});

dropArea.addEventListener("dragleave", () => {
    dropArea.style.backgroundColor = "white";
});

dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.style.backgroundColor = "white";
    const files = e.dataTransfer.files;
    uploadFiles(files);
});

dropArea.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
    uploadFiles(e.target.files);
});

function uploadFiles(files) {
    const formData = new FormData();
    for (const file of files) {
        formData.append("files[]", file);
    }

    fetch("upload.php", {
        method: "POST",
        body: formData,
    })
    .then(response => response.text())
    .then(data => alert("Upload succesvol!"))
    .catch(error => alert("Upload mislukt!"));
}

