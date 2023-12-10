<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require("./connection/connection.php");

$query = "SELECT * FROM `class`";

$result = mysqli_query($conn, $query);

if ($result) {
    $data = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode($data);
} else {
    echo json_encode(["error" => "Error fetching data!"]);
}

mysqli_close($conn);

?>