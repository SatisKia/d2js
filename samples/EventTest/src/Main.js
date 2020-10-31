#include "_Graphics.js"
#include "_Main.js"
#include "extras\_EventStep.js"

var str1 = "-";
var str2 = "-";
var str3 = "-";

var event1 = false;
var event2 = false;
var event3 = false;

var key = -1;

var ket1_step;
var ket2_step;
var ket3_step;
var mouse_step;

var w, h;

function frameTime(){ return 1000 / 15/*フレーム*/; }

function init(){
	_USE_KEY = true;
	_USE_MOUSE = true;
}

function start(){
	setCurrent( "canvas0" );

	key1_step = new _EventStep( _KEY_PRESSED_EVENT, _KEY_RELEASED_EVENT );
	key1_step.checkParam = function( param ){
		return (param == _KEY_1);
	};
	key1_step.checkTime = function(){
		return 100/*1000 / 10*/;
	};
	key2_step = new _EventStep( _KEY_PRESSED_EVENT, _KEY_RELEASED_EVENT );
	key2_step.checkParam = function( param ){
		return (param == _KEY_2);
	};
	key2_step.checkTime = function(){
		return 200/*1000 / 5*/;
	};
	key3_step = new _EventStep( _KEY_PRESSED_EVENT, _KEY_RELEASED_EVENT );
	key3_step.checkParam = function( param ){
		return (param == _KEY_3);
	};
	key3_step.checkTime = function(){
		return 333/*1000 / 3*/;
	};
	mouse_step = new _EventStep( _MOUSE_DOWN_EVENT, _MOUSE_UP_EVENT );
	mouse_step.checkParam = function( param ){
		return true;
	};
	mouse_step.checkTime = function(){
		return 200/*1000 / 5*/;
	};

	w = getBrowserWidth();
	h = getBrowserHeight();

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 24, "ＭＳ ゴシック" );

	if( event1 ){
		g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
		event1 = false;
	} else {
		g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	}
	g.drawString( str1, 10, 30 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "KEY: " + key, 10, 60 );
	g.drawString( "KEY STATE: " + getKeypadState(), 10, 90 );

	if( event2 ){
		g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
		event2 = false;
	} else {
		g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	}
	g.drawString( str2, 10, 130 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "MOUSE X: " + getMouseX(), 10, 160 );
	g.drawString( "MOUSE Y: " + getMouseY(), 10, 190 );

	if( event3 ){
		g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
		event3 = false;
	} else {
		g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	}
	g.drawString( str3, 10, 230 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "BROWSER W: " + w, 10, 260 );
	g.drawString( "BROWSER H: " + h, 10, 290 );

	g.drawString( "_EventStep TEST", 10, 330 );
	g.drawString( "KEY_1 STEP: " + key1_step.step() + " " + (key1_step.isTimeout() ? "TIMEOUT" : ""), 10, 360 );
	g.drawString( "KEY_2 STEP: " + key2_step.step() + " " + (key2_step.isTimeout() ? "TIMEOUT" : ""), 10, 390 );
	g.drawString( "KEY_3 STEP: " + key3_step.step() + " " + (key3_step.isTimeout() ? "TIMEOUT" : ""), 10, 420 );
	g.drawString( "MOUSE STEP: " + mouse_step.step() + " " + (mouse_step.isTimeout() ? "TIMEOUT" : ""), 10, 450 );
}

function processEvent( type, param ){
	key1_step.handleEvent( type, param );
	key2_step.handleEvent( type, param );
	key3_step.handleEvent( type, param );
	mouse_step.handleEvent( type, param );

	switch( type ){
	case _KEY_PRESSED_EVENT:
		str1 = "KEY PRESSED";
		event1 = true;
		key = param;
		break;
	case _KEY_RELEASED_EVENT:
		str1 = "KEY RELEASED";
		event1 = true;
		key = param;
		break;
	case _MOUSE_DOWN_EVENT:
		str2 = "MOUSE DOWN";
		event2 = true;
		break;
	case _MOUSE_MOVE_EVENT:
		str2 = "MOUSE MOVE";
		event2 = true;
		break;
	case _MOUSE_OUT_EVENT:
		str2 = "MOUSE OUT";
		event2 = true;
		break;
	case _MOUSE_UP_EVENT:
		str2 = "MOUSE UP";
		event2 = true;
		break;
	case _RESIZE_EVENT:
		str3 = "RESIZE";
		event3 = true;
		w = getBrowserWidth();
		h = getBrowserHeight();
		break;
	}
}

function error(){
	launch( "error.html" );
}
