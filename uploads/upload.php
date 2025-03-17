<?php

$uploadDir = "uploads/";

// Controleer of bestanden correct zijn geüpload
if (!isset($_FILES["files"]) || empty($_FILES["files"]["name"][0])) {
    die("Geen bestanden ontvangen!");
}

// Zorg dat de uploads-map bestaat
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

// Doorloop elk bestand in de upload-array
foreach ($_FILES["files"]["name"] as $key => $fileName) {
    $tmpName = $_FILES["files"]["tmp_name"][$key];
    $error = $_FILES["files"]["error"][$key];

    // Controleer of het bestand geen fouten bevat
    if ($error === UPLOAD_ERR_OK) {
        $filePath = $uploadDir . basename($fileName);

        if (move_uploaded_file($tmpName, $filePath)) {
            echo "Bestand " . htmlspecialchars($fileName) . " is geüpload!<br>";
            echo "Bestanden geüpload naar: " . realpath($uploadDir);

        } else {
            echo "Fout bij het uploaden van " . htmlspecialchars($fileName) . "<br>";
        }
    } else {
        echo "Upload error: " . $error . " bij bestand " . htmlspecialchars($fileName) . "<br>";
    }
}

?>
