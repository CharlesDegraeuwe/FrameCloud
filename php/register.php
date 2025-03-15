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

// Controleer de verbinding
if ($conn->connect_error) {
    die("Verbinding mislukt: " . $conn->connect_error);
}

// Gegevens van het formulier ophalen
$email = $_POST['email'] ?? '';
$name = $_POST['name'] ?? '';
$password = $_POST['password'] ?? '';



// Wachtwoord hash voor veiligheid


// SQL-query om gegevens in te voegen
$sql = "INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES (NULL, '$name', '$email', '$password')";

// Prepareer en bind de query
$stmt = $conn->prepare($sql);


// Voer de query uit
if ($stmt->execute()) {
    echo "Registratie succesvol.";
} else {
    echo "Fout bij het registreren: " . $conn->error;
}

// Sluit de verbinding
$stmt->close();
$conn->close();

?>

