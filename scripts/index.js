document.addEventListener("DOMContentLoaded", function () {
  // Make an AJAX request to get user data
  fetch("get_user.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        console.error("Error:", data.error);
        return;
      }

      // Update the HTML elements with the user data
      document.getElementById("naam-popup").textContent = data.username;
      document.getElementById("email-popup").textContent = data.email;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });
});
