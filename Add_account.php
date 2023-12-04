<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$entered_data = json_decode(file_get_contents("php://input"));

    require "./connection/connection.php";

    $query = "SELECT * FROM `student` WHERE email='$entered_data->email'";

    $result = mysqli_query($con, $query);

    if (mysqli_num_rows($result) > 0) {
        // [code => 409] => The request could not be completed due to a conflict with the current state of the resource.
        echo json_encode(["code"=> 409,"message"=> "This email is already registered!"]);
    } else {
        $insert_query = "INSERT INTO `student`(`student_name`, `email`, `password`, `gender`, `avatar`, `class_id`) 
        VALUES ('$entered_data->userName','$entered_data->email','$entered_data->password','$entered_data->gender','$entered_data->path','$entered_data->grade')";
        
        if(mysqli_query($con ,$insert_query)) { 

            // getting the student id to store it within the cookies.
            // Note: Because the id is an AUTO-INCREMENTED attribute in the database, we must obtain it using a special query.
            
            $getStudentId = "SELECT id FROM student WHERE email='$entered_data->email'";
    
            $result = mysqli_query($con ,$getStudentId);

            $row = mysqli_fetch_array($result);
    
            // Sign up process have been accomplished
            echo json_encode(["code"=> 200, "message"=> $row["id"]]);
        }  else {
            // [code => 500] => the server has encountered an unexpected condition or error that prevented it from fulfilling the request.
            echo json_encode(["code"=> 500, "message"=> "Error inserting data"]);
        }
        mysqli_close($con);
    }
?>