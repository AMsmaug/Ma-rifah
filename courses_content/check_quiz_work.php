<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$chapters = json_decode(file_get_contents("php://input"));

    require "../connection/connection.php";

    foreach($chapters as $chapter):
        
        $query = "SELECT * FROM quiz WHERE chapter_id=$chapter->chapterId";

        $result = mysqli_query($con, $query);

        $row = mysqli_fetch_array($result);

        if ($row['grade'] == 0) {
            echo $chapter->chapterNumber - 1;
            break;
        }

    endforeach;
    
    
    mysqli_close($con);

?>