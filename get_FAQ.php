<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$query = "SELECT * FROM faq";

$result = mysqli_query($con, $query);

if ($result) {

    $data = [];

    while ($row = mysqli_fetch_array($result)) {
        $questionId = $row['faq_id'];
        $faqContent = $row['faq_content'];
        $faqAnswer = $row["faq_answer"];

        array_push($data, ['questionId' => $questionId, "faqContent" => $faqContent, "faqAnswer" => $faqAnswer]);

    }

    echo json_encode(['status' => 'success', 'payload' => $data]);

} else {
    echo json_encode(['status' => 'error', 'message' => 'Error fetching data']);
}