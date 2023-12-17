<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$examId = $inputs->examId;
$problems = $inputs->problems;

$problemIds = [];
$selectedPossibilityIds = [];


$query3 = "INSERT INTO submitted_final (exam_id , problem_id , selected_possibility_id) VALUES ";

foreach ($problems as $p) {
  array_push($problemIds, $p->problemId);
  $selectedPossibilityIds[$p->problemId] = $p->choosenPossibilityId;
  $query3 .= "('$examId' , '$p->problemId' , '$p->choosenPossibilityId'), ";
}

$query3 = rtrim($query3, ', ');

$query = "SELECT
            p.problem_id,
            pp.possibility_id as correct_possibility_id 
          FROM
            final_exam_problem p
          JOIN
            final_exam_possibility pp ON p.problem_id = pp.problem_id 
          WHERE
            p.problem_id IN (" . implode(',', $problemIds) . ") AND pp.is_correct = '1'
";

$result = mysqli_query($con, $query);

if ($result) {
  $correctPossibilities = $result->fetch_all(MYSQLI_ASSOC);

  $grade = 0;

  foreach ($correctPossibilities as $correctPossibility) {
    $prbId = $correctPossibility['problem_id'];
    $correctPossibilityId = $correctPossibility['correct_possibility_id'];

    if ($correctPossibilityId == $selectedPossibilityIds[$prbId]) {
      $grade += 10;
    }
  }

  $query2 = "UPDATE final_exam SET grade='$grade' WHERE exam_id='$examId' ";

  $result2 = mysqli_query($con, $query2);

  $result3 = mysqli_query($con, $query3);

  $jsonResult = json_encode(['status' => "success", 'grade' => $grade]);

  echo $jsonResult;
} else {
  echo json_encode(["status" => "error", "message" => "error submitting exam!"]);
}