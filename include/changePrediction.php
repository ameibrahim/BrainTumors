<?php

include "databaseConnection.php";

$conn = OpenConnection();

$id = $_POST['id'];
$result = $_POST['result'];
$comment = $_POST['comment'];

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$query = "
        UPDATE predictions
        SET result='$result', comment='$comment'
        WHERE id='$id'
    ";

$result = mysqli_query($conn, $query);

if ($result)
    echo "success";
