<?php

header("Access-control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Credentials: true");

$entered_data = json_decode(file_get_contents("php://input"));
require "../connection/connection.php";
// getting student's data
$get_data_query = "SELECT * FROM `student` WHERE email='$entered_data->email' AND password='$entered_data->password'";
$result = mysqli_query($con ,$get_data_query);
$row = mysqli_fetch_array($result);
if (mysqli_num_rows($result) === 0) {
    // In case there is no affected row => wrong email or password.
    // [401 => Unauthorized]: lacks valid authentication credentials => authorization has been refused.
    echo json_encode(["code" => 401, "message" => "Incorrect email or passwrod!"]);
} else {
    // The student account have been verified, and his/her id will be returned as a message.
    echo json_encode(["code" => 200, "message" => [
        "id" => $row["id"],
        "name" => $row['student_name'],
        "profile" => $row["avatar"]
        ]
    ]);
}

mysqli_close($con);
?>