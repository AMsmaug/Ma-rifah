<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Assuming the image URL is sent in the request body
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['imageURL'])) {
        $imageURL = $data['imageURL'];

        // Specify the path to the images directory
        $uploadDirectory = 'C:\Users\abdal\OneDrive\Desktop\Ma-rifah\public\images\\';

        // Construct the full path to the image
        $imagePath = $uploadDirectory . basename($imageURL);

        // Check if the file exists
        if (file_exists($imagePath)) {
            // Attempt to remove the file
            if (unlink($imagePath)) {
                echo json_encode(["status" => "success", "message" => "File removed successfully"]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error removing file"]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "File not found"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Image URL not provided"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method"]);
}

?>