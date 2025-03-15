<?php
echo '<pre>';
print_r($_POST);
echo '</pre>';

// Databaseverbinding
$servername = "localhost";
$username = "root";
$password = "";
$database = "framecloud"; // De database-naam die uit het SQL-bestand komt

// Maak de verbinding
$conn = new mysqli($servername, $username, $password, $database);

// Controleren of de verbinding gelukt is
if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}

// Gegevens uit het formulier ophalen
$naam = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];

// SQL-query om gegevens in te voegen
$sql = "INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES (NULL, '$naam', '$email', '$password');";

if ($conn->query($sql) === TRUE) {
    header("location:../index.html");
} else {
    echo "Fout bij opslaan: " . $conn->error;
}

// Verbinding sluiten
$conn->close();

