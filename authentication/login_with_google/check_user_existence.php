<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$email = file_get_contents("php://input");

    require "../../connection/connection.php";

    $query = "SELECT * FROM student WHERE email='$email'";

    $result = mysqli_query($con, $query);

    $row = mysqli_fetch_array($result);

    if (mysqli_num_rows($result) > 0) {
        // checking for the user existince
        echo json_encode(["status" => 'exists', "id" => $row["id"]]);
    } else {
        echo json_encode(["status" => 'newUser']);
    }
    mysqli_close($con);
?>