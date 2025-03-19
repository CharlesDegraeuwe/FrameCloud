<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
$uploadDir = "uploads/";

// Controleer of bestanden correct zijn geüpload
if (!isset($_FILES["files"]) || empty($_FILES["files"]["name"][0])) {
    die("Geen bestanden ontvangen!");
}

// Zorg dat de uploads-map bestaat
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true); // Beperk de rechten tot 0755
}

// Whitelist van toegestane bestandstypes
$allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
$maxFileSize = 5 * 1024 * 1024; // 5 MB

// Doorloop elk bestand in de upload-array
foreach ($_FILES["files"]["name"] as $key => $fileName) {
    $tmpName = $_FILES["files"]["tmp_name"][$key];
    $error = $_FILES["files"]["error"][$key];
    $fileSize = $_FILES["files"]["size"][$key];
    $fileType = $_FILES["files"]["type"][$key];

    // Controleer of het bestand geen fouten bevat
    if ($error === UPLOAD_ERR_OK) {
        // Controleer bestandstype
        if (!in_array($fileType, $allowedTypes)) {
            echo "Bestandstype niet toegestaan: " . htmlspecialchars($fileName) . "<br>";
            continue;
        }

        // Controleer bestandsgrootte
        if ($fileSize > $maxFileSize) {
            echo "Bestand is te groot: " . htmlspecialchars($fileName) . "<br>";
            continue;
        }

        $filePath = $uploadDir . basename($fileName);

        if (move_uploaded_file($tmpName, $filePath)) {
            echo "Bestand " . htmlspecialchars($fileName) . " is geüpload!<br>";
        } else {
            echo "Fout bij het uploaden van " . htmlspecialchars($fileName) . "<br>";
        }
    } else {
        echo "Upload error: " . $error . " bij bestand " . htmlspecialchars($fileName) . "<br>";
    }
}

echo "Bestanden geüpload naar: " . realpath($uploadDir);

?>