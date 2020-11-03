#include "_Graphics.js"
#include "_Main.js"

var h;
var geolocation;
var code = -2;
var message = "";
var start_time = 0;
var end_time = -1;

function frameTime(){ return 1000 / 30/*フレーム*/; }

function init(){
	_USE_MOUSE = true;
	_USE_TOUCH = true;
}

function start(){
	setCurrent( "canvas0" );

//	setCanvasSize( getBrowserWidth(), getBrowserHeight() );
	setCanvasSize( 360, 360 );

	var g = getGraphics();
	g.setFont( 16, "ＭＳ ゴシック" );
	h = g.fontHeight();

	geolocation = new _Geolocation();
	geolocation.setEnableHighAccuracy( true );
	geolocation.setMaximumAgeSeconds( 5 );
	geolocation.setTimeoutSeconds( 30 );

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 16, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );

	g.drawString( "browser : " + getBrowserWidth() + " " + getBrowserHeight(), 0, h );

	g.drawString( "geolocation : " + (canUseGeolocation() ? "true" : "false"), 0, h * 2 );
	var codeString = new String();
	switch( code ){
	case _GEOLOCATION_ERROR               : codeString = "(ERROR)"               ; break;
	case _GEOLOCATION_PERMISSION_DENIED   : codeString = "(PERMISSION_DENIED)"   ; break;
	case _GEOLOCATION_POSITION_UNAVAILABLE: codeString = "(POSITION_UNAVAILABLE)"; break;
	case _GEOLOCATION_TIMEOUT             : codeString = "(TIMEOUT)"             ; break;
	case _GEOLOCATION_SUCCESS             : codeString = "(SUCCESS)"             ; break;
	}
	g.drawString( "code : " + code + codeString, 0, h * 3 );
	g.drawString( "message : " + message, 0, h * 4 );
	g.drawString( "time : " + (end_time - start_time), 0, h * 5 );
	g.drawString( "緯度 : " + geolocation.latitude(), 0, h * 6 );
	g.drawString( "経度 : " + geolocation.longitude(), 0, h * 7 );
	g.drawString( "緯度/経度の精度 : " + geolocation.accuracy(), 0, h * 8 );
	g.drawString( "高度 : " + geolocation.altitude(), 0, h * 9 );
	g.drawString( "高度の精度 : " + geolocation.altitudeAccuracy(), 0, h * 10 );
	g.drawString( "方角 : " + geolocation.heading(), 0, h * 11 );
	g.drawString( "速度 : " + geolocation.speed(), 0, h * 12 );
	g.drawString( "timestamp :", 0, h * 13 );
	g.drawString( "" + (new Date( geolocation.timestamp() )), 0, h * 14 );
}

function processEvent( type, param ){
	switch( type ){
	case _MOUSE_DOWN_EVENT:
	case _TOUCH_START_EVENT:
		if( code != -1 ){
			code = -1;
			message = "";
			start_time = currentTimeMillis();
			end_time = start_time - 1;
			geolocation.start();
		}
		break;
//	case _RESIZE_EVENT:
//		setCanvasSize( getBrowserWidth(), getBrowserHeight() );
//		break;
	}
}

function error(){
	launch( "error.html" );
}

function onGeolocation( _code, _message ){
	geolocation.stop();

	code = _code;
	message = _message;
	end_time = currentTimeMillis();

	if( code == _GEOLOCATION_SUCCESS ){
		window.open( "https://maps.googleapis.com/maps/api/staticmap?center=" + geolocation.latitude() + "," + geolocation.longitude() + "&zoom=13&size=300x300&sensor=false", "_blank", "location=yes" );
	}
}
