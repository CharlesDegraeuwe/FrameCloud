document.addEventListener("DOMContentLoaded", () => {
  console.log("Pagina geladen");

  // Formulier submit event
  const passwordForm = document.getElementById("password-form");
  if (passwordForm) {
    passwordForm.addEventListener("submit", function (e) {
      e.preventDefault();
      console.log("Formulier wordt ingediend...");

      let currentPassword = document.getElementById("current-password").value;
      let newPassword = document.getElementById("new-password").value;
      let confirmPassword = document.getElementById("confirm-password").value;
      let messageBox = document.getElementById("password-message");

      if (newPassword !== confirmPassword) {
        messageBox.style.color = "red";
        messageBox.textContent = "De nieuwe wachtwoorden komen niet overeen!";
        return;
      }

      fetch("change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Server response:", data);
          messageBox.style.color = data.success ? "green" : "red";
          messageBox.textContent = data.success
            ? "Wachtwoord succesvol gewijzigd!"
            : data.message;
        })
        .catch((error) => {
          console.error("Fetch error:", error);
          messageBox.style.color = "red";
          messageBox.textContent = "Er is een fout opgetreden.";
        });
    });
  }

  // Tabs functionaliteit
  const defaultTab = document.querySelector(
    'input[name="tab"][value="recent"]'
  );
  if (defaultTab) defaultTab.checked = true;

  function updateTabs() {
    const selectedTab = document.querySelector('input[name="tab"]:checked')?.id;
    document
      .querySelectorAll(".tab-content")
      .forEach((tab) => tab.classList.remove("active"));
    if (selectedTab)
      document
        .querySelector(`#${selectedTab}-content`)
        ?.classList.add("active");
  }

  document.querySelectorAll('input[name="tab"]').forEach((input) => {
    input.addEventListener("change", updateTabs);
  });
  updateTabs();

  // Profielfoto popup
  const profilePicture = document.getElementById("profile-picture");
  const popup = document.getElementById("popup");
  if (profilePicture && popup) {
    profilePicture.addEventListener("click", (event) => {
      event.stopPropagation();
      popup.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
      if (
        !popup.contains(event.target) &&
        !profilePicture.contains(event.target)
      ) {
        popup.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") popup.classList.remove("show");
    });
  }

  // Item toevoegen popup
  const addItem = document.getElementById("add-item");
  const popup2 = document.getElementById("popup-2");
  const container1 = document.getElementById("upload-container");
  if (addItem && popup2) {
    addItem.addEventListener("click", (event) => {
      event.stopPropagation();
      popup2.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
      if (!popup2.contains(event.target) && !addItem.contains(event.target)) {
        popup2.classList.remove("show");
        container1.classList.remove("show");
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        popup2.classList.remove("show");
        container1.classList.remove("show");
      }
    });
  }

  // E-mail invoerveld effect
  const input = document.getElementById("email");
  const bar = document.getElementById("bar");
  if (input && bar) {
    function checkInput() {
      bar.classList.toggle("filled", input.value.trim() !== "");
    }
    input.addEventListener("input", checkInput);
    input.addEventListener("blur", checkInput);
    checkInput();
  }
});
