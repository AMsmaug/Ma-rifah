<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$query = "DELETE FROM rating WHERE student_id = '$inputs->studentId' AND answer_id = '$inputs->answerId'";

$result = mysqli_query($con, $query);

?>