<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

try {
    $query = "SELECT * FROM `class`";

    $result = mysqli_query($con, $query);

    if ($result) {
        $data = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        echo json_encode(['status' => 'success', 'payload' => $data]);
    } else {
        throw new Exception("Error fetching data from the database.");
    }
} catch (Exception $e) {
    // Catch any exceptions and return an error response
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}

mysqli_close($con);
?>