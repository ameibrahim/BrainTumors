<?php

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    $id = $_POST['id'];
    $userID = $_POST['userID'];
    $date = $_POST['date'];
    $modelID = $_POST['modelID'];
    $result = $_POST['result'];
    $imageName = $_POST['imageName'];
    $fileSize = $_POST['fileSize'];

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        INSERT INTO predictions (id, userID, date, modelID, result, imageName, fileSize)
        VALUES ('$id', '$userID', '$date', '$modelID', '$result', '$imageName', '$fileSize')
    ";

    $result = mysqli_query($conn,$query);

    if($result) echo "success";
