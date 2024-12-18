<?php

    session_start();

    include "databaseConnection.php"; 

    $conn = OpenConnection();

    if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
    }

    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = "
    SELECT id, name
    FROM users 
    WHERE name = '$username' AND password = '$password'
    ";

    $result = mysqli_query($conn,$query);
    $row = mysqli_fetch_array($result);

    CloseConnection($conn);

    if(mysqli_num_rows($result) == 1){ 

        $_SESSION['id'] = $row[0];
        $_SESSION['username'] = $row[1];

        echo json_encode(
            array("id" => $row[0], "username" => $row[1], "state" => "success")
        );

    }
    else {
        echo json_encode(array("state" => "error"));
    }
