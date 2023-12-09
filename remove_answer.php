<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$answer_id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

$query = "DELETE FROM answer WHERE answer_id = $answer_id";

$result = mysqli_query($con, $query);

if ($result) {
    $response = ['status' => 'success', 'message' => 'Answer deleted successfully'];
    echo json_encode($response);
} else {
    $response = ['status' => 'error', 'message' => 'Error Deleting Answer'];
    echo json_encode($response);
}
?>