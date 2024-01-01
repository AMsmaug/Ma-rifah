<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require 'connection.php';
if (isset($_POST['questionId'])) {
    
    $questionId = $_POST['questionId'];

    $query = "SELECT answer.*,student_name
    FROM answer 
    JOIN question ON question.question_id = answer.question_id  
    JOIN student ON answer.student_id = student.id 
    WHERE answer.question_id = '$questionId'";

    $res = mysqli_query($con, $query);
    $data = [];

    while ($row = mysqli_fetch_assoc($res)) {
        $data[] = $row;
        }
        echo json_encode($data);
    }else{
        echo json_encode("Failed");
    }
?>
