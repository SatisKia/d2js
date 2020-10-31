<?php

function json_header(){
	header( 'Content-Type: application/json' );
}

function json_init(){
	global $_json_str;
	$_json_str = '';
}

function json_add_int( $key, $val ){
	global $_json_str;
	if( strlen( $_json_str ) > 0 ){
		$_json_str .= ',';
	}
	$_json_str .= "\"{$key}\":\"{$val}\"";
}

function json_add_str( $key, $val ){
	global $_json_str;
	if( strlen( $_json_str ) > 0 ){
		$_json_str .= ',';
	}
	$_json_str .= "\"{$key}\":\"" . urlencode( $val ) . '"';
}

function json_out(){
	global $_json_str;
	echo '{' . $_json_str . '}';
}

function json_post(){
	global $_json_array;
	$_json_array = json_decode( file_get_contents( 'php://input' ), true );
}

function json_get_str( $key, $def ){
	global $_json_array;
	if( $_json_array != null ){
		if( isset( $_json_array[$key] ) ){
			return urldecode( $_json_array[$key] );
		}
	}
	return $def;
}

function json_get_int( $key, $def ){
	return intval( json_get_str( $key, "{$def}" ) );
}

?>
