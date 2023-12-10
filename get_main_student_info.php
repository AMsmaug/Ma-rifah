<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$student_id = json_decode(file_get_contents("php://input"));

$query = "SELECT * 
FROM student 
WHERE id='$student_id';
";

$result = mysqli_query($con, $query);

if ($result) {

    $row = mysqli_fetch_array($result);

    $studentInfo = [
        "studentName" => $row['student_name'],
        "avatar" => $row['avatar']
    ];

    echo json_encode(["status" => "success", "message" => $studentInfo]);
} else {
    echo json_encode(["error" => "Error Fetching data!"]);
}