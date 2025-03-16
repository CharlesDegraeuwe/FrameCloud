<?php
session_start();
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['id'])) {
    echo json_encode(["success" => false, "message" => "Je moet ingelogd zijn om je wachtwoord te wijzigen."]);
    exit();
}

// Get user ID from session
$user_id = $_SESSION['id'];

// Database connection
$servername = "localhost";
$db_username = "root";
$db_password = "";
$dbname = "framecloud";

// Create connection
$conn = new mysqli($servername, $db_username, $db_password, $dbname);

// Check connection
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

// Get JSON data
$data = json_decode(file_get_contents("php://input"), true);
$currentPassword = $data["currentPassword"] ?? "";
$newPassword = $data["newPassword"] ?? "";

// Validate input
if (empty($currentPassword) || empty($newPassword)) {
    echo json_encode(["success" => false, "message" => "Vul alle velden in."]);
    exit;
}

// Get current password from database - for plaintext comparison
$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// For plaintext passwords - direct comparison
if (!$user || $currentPassword !== $user["password"]) {
    echo json_encode(["success" => false, "message" => "Huidig wachtwoord is onjuist."]);
    exit;
}

// Update with the new password (still plaintext)
$updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$updateStmt->bind_param("si", $newPassword, $user_id);
$updated = $updateStmt->execute();

if ($updated) {
    echo json_encode(["success" => true, "message" => "Wachtwoord succesvol gewijzigd."]);
} else {
    echo json_encode(["success" => false, "message" => "Er is iets misgegaan bij het bijwerken van je wachtwoord."]);
}

// Close connection
$stmt->close();
$updateStmt->close();
$conn->close();
?>