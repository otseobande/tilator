<?php

$target_dir = "fonts/";
$return_message = ['status' => 'success', 'message' => 'font file uploaded successfully'];

if(isset($_FILES["fontFile"])){
	$target_file = $target_dir . basename($_FILES["fontFile"]["name"]);
	$font_type = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	

	if($font_type != "ttf" && $font_type != "otf" && $font_type != "woff"
		&& $font_type != "woff2" && $font_type != "svg" && $font_type != "eot" ) {
	   	$return_message['status'] = 'error';
		$return_message['message'] = 'allowed font file formats are .ttf, .otf, .woff, .woff2, .svg and .eot';
	}else{
		if (file_exists($target_file)) {
		    $return_message['status'] = 'error';
		    $return_message['message'] = 'font file exists';
		}else{
			if(!move_uploaded_file($_FILES["fontFile"]["tmp_name"], $target_file)){
				$return_message['status'] = 'error';
		    	$return_message['message'] = 'error uploading file';
			}
		}
	}
}else{
	$return_message['status'] = 'error';
	$return_message['message'] = 'no file uploaded';
}


echo json_encode($return_message);

?>