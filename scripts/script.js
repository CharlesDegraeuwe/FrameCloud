
document.getElementById("password-form").addEventListener("submit", function(e) {
    console.log("Formulier wordt ingediend..."); // 🔍 Controleer of de knop werkt
    e.preventDefault();

document.addEventListener("DOMContentLoaded", () => {
  // Stel de standaard tab in
  const defaultTab = document.querySelector(
    'input[name="tab"][value="recent"]'
  );
  if (defaultTab) {
    defaultTab.checked = true;
  }

  // Laad de juiste tab-inhoud
  const selectedTab = document.querySelector('input[name="tab"]:checked').id;
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelector(`#${selectedTab}-content`).classList.add("active");

  // Voeg event listener toe voor tabwijziging
  document.querySelectorAll('input[name="tab"]').forEach((input) => {
    input.addEventListener("change", () => {
      const selectedTab = document.querySelector(
        'input[name="tab"]:checked'
      ).id;

      // Verberg alle tab-inhoud
      document.querySelectorAll(".tab-content").forEach((tab) => {
        tab.classList.remove("active");
      });

      // Toon de geselecteerde tab-inhoud
      document.querySelector(`#${selectedTab}-content`).classList.add("active");
    });
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const profilePicture = document.getElementById("profile-picture");
  const popup = document.getElementById("popup");

  // Toggle de popup bij een klik op de profielfoto
  profilePicture.addEventListener("click", (event) => {
    event.stopPropagation(); // Zorgt ervoor dat de klik niet doorbubbelt
    popup.classList.toggle("show");
  });

  // Klik buiten de popup → Sluiten
  document.addEventListener("click", (event) => {
    if (
      !popup.contains(event.target) &&
      !profilePicture.contains(event.target)
    ) {
      popup.classList.remove("show");
    }
  });

  // Druk op Escape → Sluiten
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      popup.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const addItem = document.getElementById("add-item");
  const popup2 = document.getElementById("popup-2");

  // Toggle de popup bij een klik op de profielfoto
  addItem.addEventListener("click", (event) => {
    event.stopPropagation(); // Zorgt ervoor dat de klik niet doorbubbelt
    popup2.classList.toggle("show");
  });

  // Klik buiten de popup → Sluiten
  document.addEventListener("click", (event) => {
    if (!popup2.contains(event.target) && !addItem.contains(event.target)) {
      addItem.classList.remove("show");
    }
  });

  // Druk op Escape → Sluiten
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      popup2.classList.remove("show");
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const input = document.getElementById("email");
  const bar = document.getElementById("bar");

  function checkInput() {
    if (input.value.trim() !== "") {
      bar.classList.add("filled"); // Blijft boven als er tekst is
    } else {
      bar.classList.remove("filled"); // Gaat terug als het leeg is
    }
  }

  input.addEventListener("input", checkInput);
  input.addEventListener("blur", checkInput);

  checkInput(); // Check status bij het laden van de pagina
});
document.getElementById("password-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Voorkomt standaard formulierindiening

    let currentPassword = document.getElementById("current-password").value;
    let newPassword = document.getElementById("new-password").value;
    let confirmPassword = document.getElementById("confirm-password").value;
    let messageBox = document.getElementById("password-message");

    // Controleer of het nieuwe wachtwoord en bevestigingswachtwoord overeenkomen
    if (newPassword !== confirmPassword) {
        messageBox.style.color = "red";
        messageBox.textContent = "De nieuwe wachtwoorden komen niet overeen!";
        return;
    }

    // Verstuur het verzoek naar de server
    fetch("change_password.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            messageBox.style.color = "green";
            messageBox.textContent = "Wachtwoord succesvol gewijzigd!";
        } else {
            messageBox.style.color = "red";
            messageBox.textContent = data.message;
        }
    })
    .catch(error => {
        messageBox.style.color = "red";
        messageBox.textContent = "Er is een fout opgetreden.";
    });
});
