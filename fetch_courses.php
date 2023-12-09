<?php

// This file will fetch courses with its associated chapters of the desired class

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

require("./connection/connection.php");

$class_id = filter_input(INPUT_GET, 'id', FILTER_SANITIZE_NUMBER_INT);

$query = "SELECT course.course_id, course.course_name, chapter.chapter_id, chapter.chapter_name
FROM course
JOIN chapter ON course.course_id = chapter.course_id
WHERE course.class_id = $class_id";

$result = mysqli_query($con, $query);

if ($result) {
    $courseWithChapters = $result->fetch_all(MYSQLI_ASSOC);

    $organizedData = [];

    foreach ($courseWithChapters as $row) {
        $courseId = $row['course_id'];
        $courseName = $row['course_name'];
        $chapterId = $row['chapter_id'];
        $chapterName = $row['chapter_name'];

        if (!isset($organizedData[$courseId])) {
            $organizedData[$courseId] = [
                'courseId' => $courseId,
                'courseName' => $courseName,
                'courseChapters' => [],
            ];
        }

        $organizedData[$courseId]['courseChapters'][] = [
            'chapterId' => $chapterId,
            'chapterName' => $chapterName,
        ];
    }

    $jsonResult = json_encode(array_values($organizedData));

    echo $jsonResult;
} else {
    echo json_encode(["error" => "Error fetching data!"]);
}

mysqli_close($con);

?>