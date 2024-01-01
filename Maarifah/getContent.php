<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    require 'connection.php';

    $chapterId = $_POST['chapterId'];
    $query = "SELECT * FROM `chapter_content` WHERE chapter_id = '$chapterId'";
    $res = mysqli_query($con,$query);
    while($row = mysqli_fetch_assoc($res)){
        $data[] = $row; 
    }
    echo json_encode($data);

?> 