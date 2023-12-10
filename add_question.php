<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$question = json_decode(file_get_contents("php://input"));

$imageURL = $question->imageURL;

$escapedFilePath = mysqli_real_escape_string($con, $imageURL);

$query = "INSERT INTO question (question_id , question_content , image_url , student_id , chapter_id)
 VALUES(NULL , '$question->questionContent' , '$escapedFilePath' , '$question->studentId' , '$question->chapterId')";

$result = mysqli_query($con, $query);

if ($result) {
    $lastInsertedId = mysqli_insert_id($con);
    echo json_encode(["status" => "success", "message" => "Adding Question successfully", "questionId" => $lastInsertedId]);
} else {
    echo json_encode(["status" => "error", "message" => "Error Adding Question!"]);
}