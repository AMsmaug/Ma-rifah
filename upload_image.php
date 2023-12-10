<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

<<<<<<< HEAD
$uploadDirectory = 'C:\Users\abdal\OneDrive\Desktop\Ma-rifah\public\images\\';
=======
$uploadDirectory = 'C:\Users\ammar\Desktop\Programming\Programming learning\Web programming\Senior project\Ma-rifah\public\images\\';
>>>>>>> 0423e47fccaf94910f69d335dca6c8df07a235da

if (!file_exists($uploadDirectory)) {
    mkdir($uploadDirectory, 0777, true);
}

if (isset($_FILES['fileInput'])) {
    $uploadedFile = $_FILES['fileInput'];

    if ($uploadedFile['error'] === UPLOAD_ERR_OK) {
        $originalFilename = $uploadedFile['name'];

        // Extract file extension (e.g., .jpg, .png)
        $fileExtension = strtolower(pathinfo($originalFilename, PATHINFO_EXTENSION));

        // Check if the file has a valid image extension
        $allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif'];

        if (in_array($fileExtension, $allowedImageExtensions)) {
            // Generate a unique identifier to append to the filename
            $uniqueId = uniqid();

            // Create a new filename with the unique identifier
            $newFilename = $uniqueId . '_' . $originalFilename;

            $destination = $uploadDirectory . $newFilename;

            if (move_uploaded_file($uploadedFile['tmp_name'], $destination)) {
                echo json_encode(["status" => "success", "message" => "File uploaded successfully!", "filePath" => "../../../public/images/" . $newFilename]);
            } else {
                echo json_encode(["status" => "error", "message" => "Error moving uploaded file."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => 'Invalid image format. Allowed formats: JPEG, PNG, GIF.']);
        }
    } else {
        echo json_encode(["status" => "error", "message" => 'Error uploading file.']);
    }
}
?>