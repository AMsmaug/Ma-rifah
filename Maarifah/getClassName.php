<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    require 'connection.php';
    if(isset($_POST['data'])){
        $classId = $_POST['data'];
        $query = "SELECT `class_name` FROM `class` WHERE class_id = '$classId'";
        $res= mysqli_query($con,$query);
        $row = mysqli_fetch_assoc($res);
        echo json_encode($row);
    }
?> 
