<?php

    session_start();

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $query = "
        SELECT * FROM models
    ";

    $coursesResult = mysqli_query($conn,$query);
    $courses = mysqli_fetch_all($coursesResult,MYSQLI_ASSOC);

    echo json_encode($courses);