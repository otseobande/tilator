<?php

$dir = 'fonts/';
$scanned_dir = array_slice(scandir($dir), 2);

echo json_encode($scanned_dir);