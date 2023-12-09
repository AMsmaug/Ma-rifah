<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$inputs = json_decode(file_get_contents("php://input"));

$student_id = $inputs->studentId;
$chapter_id = $inputs->chapterId;

if ($student_id != null) {

    $query = "SELECT
    q.question_id,
    q.question_content,
    q.chapter_id,
    q.date AS question_date,
    q.image_url,
    q.student_id AS question_student_id,
    s_question.student_name AS question_student_name,
    s_question.avatar AS question_student_avatar,
    a.answer_id,
    a.answer_content,
    a.answer_date,
    a.student_id AS answer_student_id,
    s_answer.student_name AS answer_student_name,
    s_answer.avatar AS answer_student_avatar,
    AVG(r.rating_value) AS average_rating,
    SUM(r.rating_value) AS sum_ratings,
    COUNT(r.rating_id) AS number_of_raters,
    MAX(CASE WHEN r.student_id =  $student_id THEN r.rating_value END) AS my_rate
    FROM
    question q
    JOIN
    student s_question ON q.student_id = s_question.id
    LEFT JOIN
    answer a ON q.question_id = a.question_id
    LEFT JOIN
    student s_answer ON a.student_id = s_answer.id
    LEFT JOIN
    rating r ON a.answer_id = r.answer_id
    WHERE
    q.chapter_id = $chapter_id
    GROUP BY
    a.answer_id;
    ";
} else {

    $query = "SELECT
    q.question_id,
    q.question_content,
    q.chapter_id,
    q.date AS question_date,
    q.image_url,
    q.student_id AS question_student_id,
    s_question.student_name AS question_student_name,
    s_question.avatar AS question_student_avatar,
    a.answer_id,
    a.answer_content,
    a.answer_date,
    a.student_id AS answer_student_id,
    s_answer.student_name AS answer_student_name,
    s_answer.avatar AS answer_student_avatar,
    AVG(r.rating_value) AS average_rating,
    SUM(r.rating_value) AS sum_ratings,
    COUNT(r.rating_id) AS number_of_raters
    FROM
    question q
    JOIN
    student s_question ON q.student_id = s_question.id
    LEFT JOIN
    answer a ON q.question_id = a.question_id
    LEFT JOIN
    student s_answer ON a.student_id = s_answer.id
    LEFT JOIN
    rating r ON a.answer_id = r.answer_id
    WHERE
    q.chapter_id = $chapter_id
    GROUP BY
    a.answer_id;
    ";
}

$result = mysqli_query($con, $query);

if ($result) {
    $questionWithAnswer = $result->fetch_all(MYSQLI_ASSOC);

    $organizedData = [];

    foreach ($questionWithAnswer as $row) {
        $questionId = $row['question_id'];
        $questionContent = $row['question_content'];
        $questionDate = $row['question_date'];
        $imageURL = $row['image_url'];
        $studentId = $row['question_student_id'];
        $studentName = $row['question_student_name'];
        $questionStudentAvatar = $row['question_student_avatar'];
        $chapterId = $row['chapter_id'];
        $answerId = $row['answer_id'];
        $answer_student_id = $row['answer_student_id'];
        $answerContent = $row['answer_content'];
        $answerDate = $row['answer_date'];
        $answerStudentName = $row['answer_student_name'];
        $answerStudentAvatar = $row['answer_student_avatar'];
        $answerAverageRating = 0;
        $answer_number_of_raters = $row['number_of_raters'];
        $answerSumRatings = 0;

        $my_rate = 0;

        if ($student_id != null) {
            $my_rate = $row['my_rate'];
            $answer_number_of_raters = $row['number_of_raters'];
        }

        if ($row['average_rating'] != null) {
            $answerAverageRating = round($row['average_rating'], 1);
            $answerSumRatings = $row['sum_ratings'];
        }

        if (!isset($organizedData[$questionId])) {
            $organizedData[$questionId] = [
                'questionId' => $questionId,
                'questionContent' => $questionContent,
                'questionDate' => $questionDate,
                'imageURL' => $imageURL,
                'studentId' => $studentId,
                'studentName' => $studentName,
                'studentAvatar' => $questionStudentAvatar,
                'chapterId' => $chapterId,
                'questionAnswers' => [],
            ];
        }

        if ($answerId != null) {
            $organizedData[$questionId]['questionAnswers'][] = [
                'answerId' => $answerId,
                'answerContent' => $answerContent,
                'answerDate' => $answerDate,
                'answerAverageRating' => $answerAverageRating,
                'answerSumRating' => $answerSumRatings,
                'myRate' => $my_rate,
                'numberOfRaters' => $answer_number_of_raters,
                'studentId' => $answer_student_id,
                'studentName' => $answerStudentName,
                'studentAvatar' => $answerStudentAvatar,
            ];
        }

    }

    $jsonResult = json_encode(array_values($organizedData));

    echo $jsonResult;
} else {
    echo json_encode(["error" => "Error fetching data!"]);
}

mysqli_close($con);


?>