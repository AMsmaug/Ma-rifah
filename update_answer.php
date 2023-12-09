<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$answer_id = $inputs->answerId;
$answer_content = $inputs->answerContent;

$query = "UPDATE answer SET answer_content='$answer_content' WHERE answer_id='$answer_id'";

$result = mysqli_query($con, $query);

if ($result) {
    $response = ['status' => 'success', 'message' => 'Record updated successfully'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Error updating data'];
    echo json_encode($response);
}