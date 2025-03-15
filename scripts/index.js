async function fetchUserData() {
  try {
    const response = await fetch("get_user.php");
    
    // Check if response is OK
    if (!response.ok) {
      console.error("Server error:", response.status);
      return;
    }
    
    const userData = await response.json();
    
    // Log data for debugging
    console.log("User data received:", userData);
    
    if (userData.error) {
      console.error("Error:", userData.error);
      return;
    }
    
    // Check if username and email exist
    if (userData.username) {
      document.getElementById("naam-popup").textContent = userData.username;
      
      // Generate initials - handles both single and multiple word usernames
      let initials = "";
      const nameParts = userData.username.split(" ");
      if (nameParts.length > 0) {
        initials = nameParts.map(word => word[0] || "").join("").toUpperCase();
      } else {
        initials = userData.username.charAt(0).toUpperCase();
      }
      
      // Update profile button with initials
      const profileInitialsElement = document.getElementById("profile-initials");
      if (profileInitialsElement) {
        profileInitialsElement.textContent = initials;
      } else {
        console.error("Element 'profile-initials' not found");
      }
    } else {
      console.error("Username not found in response");
    }
    
    // Update email if available
    if (userData.email) {
      const emailElement = document.getElementById("email-popup");
      if (emailElement) {
        emailElement.textContent = userData.email;
      } else {
        console.error("Element 'email-popup' not found");
      }
    }
    
    // Show popup
    const popupElement = document.getElementById("popup");
    if (popupElement) {
      popupElement.style.display = "block";
    } else {
      console.error("Element 'popup' not found");
    }
    
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

// Function to close the popup
function sluitPopup() {
  const popupElement = document.getElementById("popup");
  if (popupElement) {
    popupElement.style.display = "none";
  }
}

// Load user data when page loads
document.addEventListener("DOMContentLoaded", fetchUserData);