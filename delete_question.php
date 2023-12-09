<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$question_id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

$query = "DELETE FROM question WHERE question_id = $question_id";

$result = mysqli_query($con, $query);

if ($result) {
    $response = ['status' => 'success', 'message' => 'Question deleted successfully'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Error deleting data'];
    echo json_encode($response);
}