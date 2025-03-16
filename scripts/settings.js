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
      document.getElementById("naam-profiel-dashboard").textContent =
        data.username;

      document.getElementById("email-dashboard").textContent = data.email;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
});
