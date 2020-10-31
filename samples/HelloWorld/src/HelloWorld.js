#include "_Graphics.js"
#include "_Main.js"

var str;
var w, h;
var x, y;
var dx, dy;

function frameTime(){ return 1000 / 30/*フレーム*/; }

function init(){
}

function start(){
	setCurrent( "canvas0" );

	setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );

	str = "Hello World !!";

	var g = getGraphics();
	g.setFont( 24, "ＭＳ ゴシック" );
	w = g.stringWidth( str );
	h = g.fontHeight();
	x = 0;
	y = h;
	dx = 10;
	dy = 5;

	return true;
}

function paint( g ){
	x += dx;
	if( (x <= 0) || (x >= getWidth() - w) ){
		dx = -dx;
	}
	y += dy;
	if( (y <= h) || (y >= getHeight()) ){
		dy = -dy;
	}
	if( x < 0 ){
		x = 0;
	}
	if( x > getWidth() - w ){
		x = getWidth() - w;
	}
	if( y < h ){
		y = h;
	}
	if( y > getHeight() ){
		y = getHeight();
	}

	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 24, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.drawString( str, x, y );
}

function processEvent( type, param ){
	if( type == _RESIZE_EVENT ){
		setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );
	}
}

function error(){
	launch( "error.html" );
}
