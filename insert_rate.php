<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$query = "INSERT INTO rating VALUES (NULL , '$inputs->ratingValue' , '$inputs->studentId' , '$inputs->answerId')";

$result = mysqli_query($con, $query);

?>