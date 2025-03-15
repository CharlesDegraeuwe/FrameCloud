<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

// Database connection parameters - update these with your actual values
$servername = "localhost";  // Usually "localhost"
$db_username = "root";
$db_password = "";
$dbname = "framecloud";  // Your database name from the SQL file

// Create connection
$conn = new mysqli($servername, $db_username, $db_password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Determine what identifier we have in the session
// You might have user ID, email, or username stored in the session
$userId = isset($_SESSION['user']['id']) ? $_SESSION['user']['id'] : null;
$userEmail = isset($_SESSION['user']['email']) ? $_SESSION['user']['email'] : null;

// Build query based on available identifier
if ($userId) {
    $stmt = $conn->prepare("SELECT username, email FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
} elseif ($userEmail) {
    $stmt = $conn->prepare("SELECT username, email FROM users WHERE email = ?");
    $stmt->bind_param("s", $userEmail);
} else {
    echo json_encode(['error' => 'No user identifier found in session']);
    exit;
}

// Execute query
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    echo json_encode([
        'username' => $user['username'],
        'email' => $user['email']
    ]);
} else {
    echo json_encode(['error' => 'User not found in database']);
}

$stmt->close();
$conn->close();
?>