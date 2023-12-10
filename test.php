<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$url = 'C:\Users\abdal\OneDrive\Desktop\Ma-rifah\public\images\6566d30858e6c_mikasa4.jpg';

$escapedFilePath = mysqli_real_escape_string($con, $url);

$query = "INSERT INTO question (question_id , question_content , image_url , student_id , chapter_id)
 VALUES(NULL , 'ohayoooo' , '$escapedFilePath' , '3' , '1')";

$result = mysqli_query($con, $query);

if ($result) {
    $lastInsertedId = mysqli_insert_id($con);
    echo json_encode(["success" => "Adding Question successfully", "message" => $lastInsertedId]);
} else {
    echo json_encode(["error" => "Error Adding Question!"]);
}