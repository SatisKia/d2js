<?php

$character = '';

if( isset( $_GET['character'] ) ){
	$character = $_GET['character'];
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
header( 'Content-Type: text/plain' );
echo 'character=' . urlencode( $character );
echo '&image=res/' . $image;

?>
