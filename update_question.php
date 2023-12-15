<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$question = json_decode(file_get_contents("php://input"));

$question_id = $question->questionId;
$question_content = $question->questionContent;

$imageURL = $question->imageURL;

$escapedFilePath = mysqli_real_escape_string($con, $imageURL);


$query = "UPDATE question SET question_content='$question_content' , image_url='$escapedFilePath' , is_modified='1'  WHERE question_id='$question_id'";

$result = mysqli_query($con, $query);

if ($result) {
    $response = ['status' => 'success', 'message' => 'Record updated successfully'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Error updating data'];
    echo json_encode($response);
}
