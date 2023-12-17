<?php

// This file checks if there is a final exam that is submitted by the studentId and courseId passed as parameters if there
// is a submitted final exam it will get it.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$course_id = $inputs->courseId;
$student_id = $inputs->studentId;

$query = "SELECT
c.course_name,
fe.exam_id,
fe.grade,
sf.problem_id,
sf.selected_possibility_id,
fp.problem_content,
fep.possibility_id,
fep.possibility_content,
fep.is_correct
FROM
final_exam fe
JOIN
submitted_final sf ON fe.exam_id = sf.exam_id
JOIN
final_exam_problem fp ON sf.problem_id = fp.problem_id
JOIN
final_exam_possibility fep ON fp.problem_id = fep.problem_id
JOIN
course c ON c.course_id = '$course_id'
WHERE
fe.course_id = '$course_id'
AND fe.student_id = '$student_id';";

$result = mysqli_query($con, $query);

if ($result) {

    if (mysqli_num_rows($result) > 0) {

        $data = array();

        $examId;
        $grade;
        $courseName;

        while ($row = mysqli_fetch_assoc($result)) {

            $examId = $row['exam_id'];
            $grade = $row['grade'];
            $courseName = $row['course_name'];
            $problemId = $row['problem_id'];
            $problemContent = $row['problem_content'];
            $choosenPossibilityId = $row['selected_possibility_id'];
            $possibilityId = $row['possibility_id'];
            $possibilityContent = $row['possibility_content'];
            $isCorrect = $row['is_correct'];

            if (!isset($data[$problemId])) {

                $data[$problemId] = array(
                    'problemId' => $problemId,
                    'problemContent' => $problemContent,
                    'choosenPossibilityId' => $choosenPossibilityId,
                    'problemPossibilities' => array(),
                );
            }

            $data[$problemId]['problemPossibilities'][] = array(
                'possibilityId' => $possibilityId,
                'possibilityContent' => $possibilityContent,
                'is_correct' => $isCorrect,
            );
        }

        $problems = array_values($data);

        $finalData = ['examId' => $examId, "courseName" => $courseName, "grade" => $grade, "problems" => $problems];

        echo json_encode(['status' => 'success', 'message' => 'submitted final exam exists', 'payload' => $finalData]);

    } else {
        echo json_encode(['status' => 'success', 'message' => 'No submitted final exam']);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Error fetching data"]);
}

?>