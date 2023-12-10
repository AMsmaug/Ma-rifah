<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$student_id = $inputs->studentId;
$answer_id = $inputs->answerId;
$rating_value = $inputs->ratingValue;

$query = "UPDATE rating SET rating_value='$rating_value' WHERE student_id='$student_id' AND answer_id='$answer_id'";

$result = mysqli_query($con, $query);

if ($result) {
    $response = ['status' => 'success', 'message' => 'Record updated successfully'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Error updating data'];
    echo json_encode($response);
}