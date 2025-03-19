<?php
$file = "/Applications/XAMPP/xamppfiles/htdocs/FrameCloud/uploads/test.txt";
if (file_put_contents($file, "Test")) {
    echo "Bestand succesvol geschreven!";
} else {
    echo "Fout bij het schrijven van het bestand.";
}
?>