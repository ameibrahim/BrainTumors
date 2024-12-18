<?php

    session_start();

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        SELECT models.id, models.filename, models.featureInputSize, models.accuracy FROM `modelSettings` 
        INNER JOIN models ON models.id = modelSettings.modelID
        WHERE modelSettings.id = 'default'
    ";

    $coursesResult = mysqli_query($conn,$query);
    $courses = mysqli_fetch_all($coursesResult,MYSQLI_ASSOC);

    echo json_encode($courses);