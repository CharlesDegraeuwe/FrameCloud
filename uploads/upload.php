<?php

$uploadDir = "uploads/";
foreach ($_FILES["files"]["tmp_name"] as $key => $tmpName) {
    $filePath = $uploadDir . basename($_FILES["files"]["name"][$key]);
    move_uploaded_file($tmpName, $filePath);
}
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0777, true);
}

echo "Bestanden geüpload!";
?>
