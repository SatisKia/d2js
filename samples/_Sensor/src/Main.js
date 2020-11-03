#include "_Graphics.js"
#include "_Main.js"

var h;
var o;

function frameTime(){ return 1000 / 30/*フレーム*/; }

function init(){
}

function start( g ){
	setCurrent( "canvas0" );

	setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );

	var g = new _Graphics();
	g.setFont( 16, "ＭＳ ゴシック" );
	h = g.fontHeight();

	o = getOrientation();

	sensorStart();

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 16, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );

	g.drawString( "devicemotion : " + (canUseDeviceMotion() ? "true" : "false"), 0, h );
	g.drawString( "accelX : "       + Math.floor( getAccelX() * 100 ), 0, h * 2 );
	g.drawString( "accelY : "       + Math.floor( getAccelY() * 100 ), 0, h * 3 );
	g.drawString( "accelZ : "       + Math.floor( getAccelZ() * 100 ), 0, h * 4 );
	g.drawString( "gravityX : "     + Math.floor( getGravityX() ), 0, h * 5 );
	g.drawString( "gravityY : "     + Math.floor( getGravityY() ), 0, h * 6 );
	g.drawString( "gravityZ : "     + Math.floor( getGravityZ() ), 0, h * 7 );
	g.drawString( "linearAccelX : " + Math.floor( getLinearAccelX() * 100 ), 0, h * 8 );
	g.drawString( "linearAccelY : " + Math.floor( getLinearAccelY() * 100 ), 0, h * 9 );
	g.drawString( "linearAccelZ : " + Math.floor( getLinearAccelZ() * 100 ), 0, h * 10 );

	var x = 0;
	var i = 12;
	if( (o == 90) || (o == -90) ){
		x = 150;
		i = 1;
	}

	g.drawString( "deviceorientation : " + (canUseDeviceOrientation() ? "true" : "false"), x, h * i );
	g.drawString( "azimuth : " + Math.floor( getAzimuth() ), x, h * (i + 1) );
	g.drawString( "pitch : "   + Math.floor( getPitch  () ), x, h * (i + 2) );
	g.drawString( "roll : "    + Math.floor( getRoll   () ), x, h * (i + 3) );

	g.drawString( "orientation : " + o, x, h * (i + 5) );
}

function processEvent( type, param ){
	switch( type ){
	case _ORIENTATIONCHANGE_EVENT:
		o = param;
		break;
	case _RESIZE_EVENT:
		setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );
		break;
	}
}

function error(){
	launch( "error.html" );
}
