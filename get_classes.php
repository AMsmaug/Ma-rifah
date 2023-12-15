<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$query = "SELECT * FROM `class`";

$result = mysqli_query($con, $query);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode(['status' => 'success', 'payload' => $data]);
} else {
    echo json_encode(['status' => "error", 'message' => "Error fetching data!"]);
}

mysqli_close($con);

?>