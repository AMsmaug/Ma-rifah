<?php 

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

require "./connection/connection.php";

$get_grades_query = "SELECT * FROM class";

$result = mysqli_query($con, $get_grades_query);

$grades;

while($row = mysqli_fetch_array($result)) {

$grades[] = ["grade_id" => $row['class_id'], "grade_name" => $row['class_name']];

}

echo json_encode($grades);

?>