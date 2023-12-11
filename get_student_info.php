<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$id = json_decode(file_get_contents("php://input"));

require "./connection/connection.php";

// $student_info_query = "SELECT s.class_id, c.*, t.status AS studying_progress, t.grade AS student_grade 
// FROM student s JOIN take t ON s.id = t.student_id JOIN course c ON t.course_id = c.course_id
// WHERE s.id = $entered_data->id;";

$student_info_query = "SELECT student.id AS student_id, course.*, take.grade, take.status
    FROM student, course, take
    WHERE take.course_id = course.course_id AND student.id = take.student_id AND student.id = $id;";

$result = mysqli_query($con, $student_info_query);

$courses;

while ($row = mysqli_fetch_array($result)) {
    $courses[] = [
        "courseId" => $row['course_id'],
        "courseName" => $row['course_name'],
        "fullMark" => $row['full_mark'],
        "studentGrade" => $row['grade'],
        "courseStatus" => $row['status']
    ];
}

echo json_encode($courses);

mysqli_close($con);

?>