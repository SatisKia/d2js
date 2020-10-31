/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function canUseVibration(){
	navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
	return !!navigator.vibrate;
}

function startVibrate(){
	if( navigator.vibrate || canUseVibration() ){
		navigator.vibrate( 99999 );
	}
}

function stopVibrate(){
	if( navigator.vibrate || canUseVibration() ){
		navigator.vibrate( 0 );
	}
}

function vibrate( time ){
	if( navigator.vibrate || canUseVibration() ){
		navigator.vibrate( time );
	}
}
