<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$entered_data = json_decode(file_get_contents("php://input"));

    require "../connection/connection.php";

    if (is_object($entered_data)) {

        $query = "SELECT course.course_id FROM student, course, take
        WHERE take.course_id = course.course_id AND student.id = take.student_id 
        AND student.id = $entered_data->studentId AND course.course_name = \"$entered_data->courseName\";";

        $result = mysqli_query($con, $query);

        echo json_encode(mysqli_fetch_array($result));
        
    } else {
        $qurey = "SELECT `chapter_id` AS chapterId,`chapter_name` AS chapterName, `chapter_number` AS chapterNumber
         FROM chapter
         WHERE course_id = $entered_data
         ORDER BY chapter_number;";
    
         $result = mysqli_query($con, $qurey);
    
        $chapters;
    
         while($row = mysqli_fetch_array($result)) {
            $chapters[] = [
                "chapterId" => $row["chapterId"],
                "chapterNumber" => $row['chapterNumber'] ,
                "chapterName" => $row['chapterName']
            ];
         }
    
        echo json_encode($chapters);

    }
    
    mysqli_close($con);

?>