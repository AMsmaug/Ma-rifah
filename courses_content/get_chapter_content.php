<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$chapterId = json_decode(file_get_contents("php://input"));

    require "../connection/connection.php";

    $chapterIntro;
    $chapterContent;

    $chapterIntroQuery = "SELECT * FROM chapter WHERE chapter_id = $chapterId;";

    $chapterContentQuery = "SELECT * FROM `chapter_content` WHERE chapter_id = $chapterId ORDER BY order_in_page;";

    $introResult = mysqli_query($con,$chapterIntroQuery);
    $contentResult = mysqli_query($con,$chapterContentQuery);

    $row = mysqli_fetch_array($introResult);

    $chapterIntro = [
        "chapterName" => $row['chapter_name'],
        "chapterNumber" => $row['chapter_number'] ,
        "videoUrl" => $row['video_url'],
        "description" => $row['description']
    ];

    while($row = mysqli_fetch_array($contentResult)) {
        $chapterContent[] = [
            "contentId" => $row['content_id'],
            "type" => $row['type'],
            "content" => $row['content'],
            "order" => $row['order_in_page'],
        ];
    }

    echo json_encode([
        "intro" => $chapterIntro,
        "content" => $chapterContent
    ]);
    
    mysqli_close($con);

?>