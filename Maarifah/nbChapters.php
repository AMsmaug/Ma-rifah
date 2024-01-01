<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    require 'connection.php';
    $course_id = $_POST['data'];
    $query = "SELECT * FROM `chapter` WHERE course_id = '$course_id'";
    $res = mysqli_query($con,$query);

    echo ((mysqli_affected_rows($con)));

?> 