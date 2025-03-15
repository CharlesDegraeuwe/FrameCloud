<?php
$host = 'localhost'; // of de juiste server
$dbname = 'FrameCloud'; // vervang door je eigen database naam
$username = 'MODERATOR'; // vervang door je MySQL gebruikersnaam
$password = 'wachtwoord'; // vervang door je MySQL wachtwoord

// Maak verbinding
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    // Zet de foutmodus op uitzondering
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Verbinding mislukt: " . $e->getMessage();
}

$pdo = new PDO("mysql:host=$host;port=3306;dbname=$dbname", $username, $password);

?>
