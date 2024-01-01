<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    require 'connection.php';
    if(isset($_POST['data'])){
    $course_id = $_POST['data'];
    $query = "SELECT * FROM `chapter` WHERE course_id = '$course_id'";
    $res= mysqli_query($con,$query);
        while($row = mysqli_fetch_assoc($res)){
            $data[] = $row; 
        }
    echo json_encode($data);
    }
    
    
?> 
