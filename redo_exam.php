<?php


header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$examId = json_decode(file_get_contents("php://input"));


$query = "DELETE FROM final_exam WHERE exam_id ='$examId'";

$result = mysqli_query($con, $query);

if ($result) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(["status" => 'error', 'message' => 'failed redoing the exam!']);
}
