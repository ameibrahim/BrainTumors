<?php
if (isset($_FILES['file'])) {
    $temp_file = $_FILES['file']['tmp_name'];
    $uploads_folder = "../uploads/";

    $temp = explode(".", $_FILES["file"]["name"]);
    $newfilename = round(microtime(true)) . '.' . end($temp);
    $upload = move_uploaded_file($_FILES["file"]["tmp_name"], $uploads_folder . $newfilename);

    if ($upload) {
        echo $newfilename; // Return the new filename
    } else {
        echo "File upload failed."; // Error handling
    }
} else {
    echo "No file uploaded."; // Handle case where no file is uploaded
}
