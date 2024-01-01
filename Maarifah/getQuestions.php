<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
require 'connection.php';
if (isset($_POST['chapterId'])) {
    
    $chapterId = $_POST['chapterId'];

    $query = "SELECT question.*,student_name
    FROM question 
    JOIN chapter ON question.chapter_id = chapter.chapter_id  
    JOIN student ON question.student_id = student.id 
    WHERE question.chapter_id = '$chapterId'";

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
