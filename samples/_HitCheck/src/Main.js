#include "_Graphics.js"
#include "_Main.js"
#include "extras\_HitCheck.js"

var hit;

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_MOUSE = true;
}

function start(){
	setCurrent( "canvas0" );

	hit = new _HitCheck();

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	var r0  = 50;
	var cx0 = getWidth () / 2;
	var cy0 = getHeight() / 2;
	var r1  = 30;
	var cx1 = getMouseX();
	var cy1 = getMouseY();
	var x0  = cx0 - r0 - 15;
	var y0  = cy0 - r0;
	var w0  = r0 * 2 + 30;
	var h0  = r0 * 2;
	var x1  = cx1 - r1;
	var y1  = cy1 - r1 - 15;
	var w1  = r1 * 2;
	var h1  = r1 * 2 + 30;
	var check = false;

	g.setStrokeWidth( 1 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawCircle( cx0, cy0, r0 );
	g.drawCircle( cx1, cy1, r1 );
	g.drawRect( x0, y0, w0, h0 );
	g.drawRect( x1, y1, w1, h1 );

	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 24, "ＭＳ ゴシック" );
	hit.initCircle( r0, r1 );
	check = hit.circle( cx0, cy0, cx1, cy1 );
	g.drawString( "HIT CIRCLE           : " + (check ? "true" : "false"), 10,  30 );
	hit.initCircleAndRect( r0 );
	check = hit.circleAndRect( cx0, cy0, x1, y1, x1 + w1 - 1, y1 + h1 - 1 );
	g.drawString( "HIT CIRCLE AND RECT 1: " + (check ? "true" : "false"), 10,  60 );
	hit.initCircleAndRect( r1 );
	check = hit.circleAndRect( cx1, cy1, x0, y0, x0 + w0 - 1, y0 + h0 - 1 );
	g.drawString( "HIT CIRCLE AND RECT 2: " + (check ? "true" : "false"), 10,  90 );
	check = hit.rect( x0, y0, x0 + w0 - 1, y0 + h0 - 1, x1, y1, x1 + w1 - 1, y1 + h1 - 1 );
	g.drawString( "HIT RECT             : " + (check ? "true" : "false"), 10, 120 );
}

function error(){
	launch( "error.html" );
}
