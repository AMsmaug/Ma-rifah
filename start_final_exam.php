<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$student_id = $inputs->studentId;
$course_id = $inputs->courseId;

$query1 = "SELECT
p.problem_id,
p.problem_content,
pp.possibility_id,
pp.possibility_content,
pp.is_correct,
f.final_duration,
c.course_name
FROM
(
    SELECT
        problem_id
    FROM
        final_exam_problem
    WHERE
        course_id = $course_id
    ORDER BY RAND()
    LIMIT 10
) AS random_problems
JOIN
    final_exam_problem p ON random_problems.problem_id = p.problem_id
JOIN
    final_exam_possibility pp ON p.problem_id = pp.problem_id
JOIN
    course c ON p.course_id = c.course_id 
JOIN
    final_information f ON f.course_id = $course_id
ORDER BY
      RAND();
";

$query2 = "INSERT INTO final_exam (exam_id  , student_id , course_id) VALUES
 (NULL , '$student_id' , '$course_id')";

$result = mysqli_query($con, $query1);

if ($result) {

    $result2 = mysqli_query($con, $query2);

    if ($result2) {
        $lastInsertedId = mysqli_insert_id($con);

        $organizedData = [];

        $final_exam_duration;
        $course_name;

        while ($row = mysqli_fetch_array($result)) {

            $problemId = $row['problem_id'];
            $problemContent = $row['problem_content'];
            $final_exam_duration = $row['final_duration'];
            $course_name = $row['course_name'];
            $possibilityId = $row['possibility_id'];
            $possibilityContent = $row['possibility_content'];

            if (!isset($organizedData[$problemId])) {
                $organizedData[$problemId] = [
                    'problemId' => $problemId,
                    'problemContent' => $problemContent,
                    'choosenPossibilityId' => null,
                    'problemPossibilities' => []
                ];
            }

            if (!isset($organizedData[$problemId]['problemPossibilities'])) {
                $organizedData[$problemId]['problemPossibilities'] = [];
            }

            if ($possibilityId != null) {
                $organizedData[$problemId]['problemPossibilities'][] = [
                    'possibilityId' => $possibilityId,
                    'possibilityContent' => $possibilityContent,
                ];
            }
        }

        $trimmedArray = array_slice($organizedData, 0, 10);

        $dataToSend = ["examId" => "$lastInsertedId", "courseName" => $course_name, "finalExamDuration" => $final_exam_duration, "examProblems" => $trimmedArray];

        echo json_encode(['status' => "success", "payload" => $dataToSend]);

    } else {
        echo json_encode(["status" => "error", "message" => "Error starting exam"]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Error starting exam"]);
}