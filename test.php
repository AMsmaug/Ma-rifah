<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

$entered_data = json_decode(file_get_contents("php://input"));

echo "your name is $entered_data->name";
