<?php
$host = 'localhost'; // of de juiste server
$dbname = 'framecloud'; // vervang door je eigen database naam
$username = 'root'; // vervang door je MySQL gebruikersnaam
$password = ''; // vervang door je MySQL wachtwoord

// Maak verbinding
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Zet de foutmodus op uitzondering
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Verbinding mislukt: " . $e->getMessage();
}



?>
