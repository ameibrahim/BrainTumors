<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $imageName = $_POST['imageName'] ?? null;
    $uploadFolderPath = $_POST['uploadFolderPath'] ?? null;
    $newFolderName = $_POST['newFolderName'] ?? null;

    // Validate input
    if (!$imageName || !$uploadFolderPath || !$newFolderName) {
        die("Error: Missing one or more required parameters: imageName, uploadFolderPath, newFolderName.");
    }

    // Normalize paths and validate
    $uploadFolderPath = realpath($uploadFolderPath);
    if ($uploadFolderPath === false) {
        die("Error: The upload folder path is invalid.");
    }

    // Sanitize new folder name
    $newFolderName = basename($newFolderName); // Extract only the folder name, preventing directory traversal
    $newFolderPath = $uploadFolderPath . '/' . $newFolderName;

    function copyFileToNewFolder($imageName, $sourceFolderPath, $targetFolderPath)
    {
        $sourceFile = $sourceFolderPath . '/' . $imageName;

        if (!file_exists($sourceFile)) {
            die("Error: The file '$imageName' does not exist in the folder '$sourceFolderPath'.");
        }

        if (!file_exists($targetFolderPath)) {
            if (!mkdir($targetFolderPath, 0777, true)) {
                die("Error: Failed to create the folder '$targetFolderPath'.");
            }
        }

        $destinationFile = $targetFolderPath . '/' . $imageName;

        if (copy($sourceFile, $destinationFile)) {
            echo "File '$imageName' successfully copied to '$targetFolderPath'.";
        } else {
            die("Error: Failed to copy the file '$imageName' to '$targetFolderPath'.");
        }
    }

    copyFileToNewFolder($imageName, $uploadFolderPath, $newFolderPath);
} else {
    echo "Error: Invalid request method. Please use POST.";
}
?>