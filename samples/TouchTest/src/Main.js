#include "_Graphics.js"
#include "_Main.js"

var str1 = "";

var event1 = false;

function frameTime(){ return 1000 / 15/*フレーム*/; }

function init(){
	_USE_TOUCH = true;
}

function start(){
	setCurrent( "canvas0" );

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
		g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	}
	g.drawString( str1, 10, 30 );
	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.drawString( "TOUCH NUM: " + touchNum(), 10, 60 );
	for( var i = 0; i < touchNum(); i++ ){
		g.drawString( "X:" + getTouchX( i ), 10 + i * 100,  90 );
		g.drawString( "Y:" + getTouchY( i ), 10 + i * 100, 120 );
	}
}

function processEvent( type, param ){
	switch( type ){
	case _TOUCH_START_EVENT:
		str1 = "TOUCH START";
		event1 = true;
		break;
	case _TOUCH_MOVE_EVENT:
		str1 = "TOUCH MOVE";
		event1 = true;
		break;
	case _TOUCH_END_EVENT:
		str1 = "TOUCH END";
		event1 = true;
		break;
	}
}

function error(){
	launch( "error.html" );
}
