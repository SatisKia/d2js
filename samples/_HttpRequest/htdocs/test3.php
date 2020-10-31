<?php

require_once( 'json.php' );

$character = '';

if( ($data = json_decode( file_get_contents( 'php://input' ), true )) != null ){
	if( isset( $data['character'] ) ){
		$character = urldecode( $data['character'] );
	}
}

$image = 'error.jpg';
if( $character === 'こむ' ){
	$image = 'com.jpg';
} else if( $character === 'ラクス' ){
	$image = 'rax.jpg';
} else if( $character === 'レイ' ){
	$image = 'ray.jpg';
}

header( "Access-Control-Allow-Origin: *" );
header( "Access-Control-Allow-Headers: Content-Type" );
json_header();
//echo '[';
json_init();
json_add_str( 'character', $character );
json_add_str( 'image', $image );
json_out();
//echo ',';
//	:
//	:
//echo ']';

?>
