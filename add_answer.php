<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$answer = json_decode(file_get_contents("php://input"));

$query = "INSERT INTO answer (answer_id , answer_content , student_id , question_id)
 VALUES(NULL , '$answer->answerContent' , '$answer->studentId' , '$answer->questionId')";

$result = mysqli_query($con, $query);

if ($result) {
    $lastInsertedId = mysqli_insert_id($con);
    echo json_encode(["success" => "Adding answer successfully", "message" => $lastInsertedId]);
} else {
    echo json_encode(["error" => "Error Adding Answer!"]);
}