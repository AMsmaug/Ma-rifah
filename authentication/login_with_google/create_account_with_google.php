<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$userInfo = json_decode(file_get_contents("php://input"));

    require "../../connection/connection.php";

    $query = "INSERT INTO `student`(`student_name`, `email`, `password`, `avatar`, `class_id`) VALUES
     ('$userInfo->username','$userInfo->email',NULL,'$userInfo->picture','$userInfo->grade')";

    $result = mysqli_query($con, $query);

    if ($result) {
        $getStudentId = "SELECT id FROM student WHERE email='$userInfo->email'";
    
        $result = mysqli_query($con ,$getStudentId);

        $studentId = mysqli_fetch_array($result);

        $registerCoursesQuery = "SELECT * FROM  course WHERE class_id=$userInfo->grade";

            $result = mysqli_query($con, $registerCoursesQuery);
            
            $data;

            while ($row = mysqli_fetch_array($result)) {
                $data[] = "('" . $studentId["id"] . "','" . $row['course_id'] . "','0','in_progress')";
            }
            $registerQuery = "INSERT INTO `take`(`student_id`, `course_id`, `grade`, `status`) VALUES " . implode(",", $data); 
            mysqli_query($con, $registerQuery);

            echo $studentId['id'];
    } else {
        echo "Error inserting data!";
    }

    mysqli_close($con);
    
?>