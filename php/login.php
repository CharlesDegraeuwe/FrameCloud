<?php
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Check if form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Database connection
    $servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $database = "framecloud";

    // Create connection
    $conn = new mysqli($servername, $db_username, $db_password, $database);

    // Check connection
    if ($conn->connect_error) {
        die("Verbinding mislukt: " . $conn->connect_error);
    }

    // Get data from form
    $email = $_POST['email'];
    $password = $_POST['password'];

    // SQL query to check if user exists
    $sql = "SELECT id, username, email, password FROM users WHERE email = ?"; 
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $email); // ✅ Gebruik email i.p.v. id
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        // User found, fetch data
        $user = $result->fetch_assoc();
        error_log("Debug: Gebruikersdata: " . print_r($user, true), 3, "debug.log");


        // ✅ Correcte sessie opslaan
        $_SESSION['id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['email'] = $user['email'];
        $_SESSION['user'] = [
            'id' => $user['id'],
            'name' => $user['name'], // ✅ Controleer dat username hier correct staat
            'email' => $user['email']
        ];

        // Redirect to dashboard
        header("Location: ../index.php");
        exit;
    } else {
        // User not found, redirect with error
        header("Location: ../login.html?error=invalid");
        exit;
    }

    // Close connection
    $stmt->close();
    $conn->close();
} else {
    // If accessed directly, redirect to login
    header("Location: ../login.html");
    exit;
}
?>
