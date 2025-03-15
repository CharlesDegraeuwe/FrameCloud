<?php
session_start();

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $servername = "localhost";
    $username = "root";
    $password = "";
    $database = "framecloud";

    // Create connection
    $conn = new mysqli($servername, $username, $password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Verbinding mislukt: " . $conn->connect_error);
    }

    // Get data from form
    $email = $_POST['email'];
    $password = $_POST['password'];

    // SQL query to check if user exists
    $sql = "SELECT id, username, email, password FROM users WHERE email = '$email' AND password = '$password'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        // User found, set session variables
        $row = $result->fetch_assoc();
        $_SESSION['loggedin'] = true;
        $_SESSION['id'] = $row['id'];
        $_SESSION['username'] = $row['username'];
        $_SESSION['email'] = $row['email'];
        
        $_SESSION['user'] = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $email
            ];

        // Redirect to dashboard or home page
        header("Location: ../index.html");
     
        
        exit;
    } else {
        // User not found, redirect back to login page with error
        header("Location: ../login.html?error=invalid");
        exit;
    }

    // Close connection
    $conn->close();
} else {
    // If accessed directly without POST data, redirect to login page
    header("Location: ../login.html");
    exit;
}
?>