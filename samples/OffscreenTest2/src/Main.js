#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"
#include "_Random.js"
#include "_Vector.js"

#include "MainObject.js"

var rand;
var object;

var touch_sx;
var touch_sy;
var touch_ex;
var touch_ey;
var touch;

var _elapse;	// 経過時間
var _time;		//

// オフスクリーン用
var off_img;
var str;
var w, h;
var x, y;
var dx, dy;

var x2, y2;
var dx2, dy2;

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_REQUESTANIMATIONFRAME = true;
	_USE_TOUCH = true;
}

function start(){
	setCurrent( "canvas0" );

	if( _USE_REQUESTANIMATIONFRAME ){
		if( !!window.requestAnimationFrame ){
			document.getElementById( "div0" ).innerHTML = "requestAnimationFrame";
		} else if( !!window.webkitRequestAnimationFrame ){
			document.getElementById( "div0" ).innerHTML = "webkitRequestAnimationFrame";
		} else if( !!window.mozRequestAnimationFrame ){
			document.getElementById( "div0" ).innerHTML = "mozRequestAnimationFrame";
		} else if( !!window.oRequestAnimationFrame ){
			document.getElementById( "div0" ).innerHTML = "oRequestAnimationFrame";
		} else if( !!window.msRequestAnimationFrame ){
			document.getElementById( "div0" ).innerHTML = "msRequestAnimationFrame";
		} else {
			document.getElementById( "div0" ).innerHTML = "setTimeout";
		}
	} else {
		document.getElementById( "div0" ).innerHTML = "setTimeout";
	}

	rand = new _Random();
	object = new _Vector( 128 );

	touch = false;

	_elapse = 0;
	_time = currentTimeMillis();

	// オフスクリーン用
	var g = getGraphics();
	off_img = new _Image( 300, 200 );
	str = "Hello World !!";
	g.setFont( 16, "ＭＳ ゴシック" );
	w = g.stringWidth( str );
	h = g.fontHeight();
	x = 0;
	y = h;
	dx = 5;
	dy = 3;

	x2 = 0;
	y2 = 0;
	dx2 = 1;
	dy2 = 1;

	// オフスクリーンに描画
	off_paint( g );

	return true;
}

function off_paint( g ){
	off_img.lock();

	x += dx;
	if( (x <= 0) || (x >= getWidth() - w) ){
		dx = -dx;
	}
	y += dy;
	if( (y <= h) || (y >= getHeight()) ){
		dy = -dy;
	}

	g.setColor( g.getColorOfRGB( 255, 127, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 16, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawString( str, x, y );

	off_img.unlock();
}

function paint( g ){
	var i;
	var tmp;

	for( i = 0; i < object.size(); i++ ){
		tmp = object.elementAt( i );
		tmp.update();
	}

	x2 += dx2;
	if( (x2 <= 0) || (x2 >= getWidth() - off_img.getWidth()) ){
		dx2 = -dx2;
	}
	y2 += dy2;
	if( (y2 <= 0) || (y2 >= getHeight() - off_img.getHeight()) ){
		dy2 = -dy2;
	}

	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );
	for( i = 0; i < object.size(); i++ ){
		tmp = object.elementAt( i );
		tmp.draw( g );
	}

	// キャンバスにオフスクリーンイメージを描画
	g.drawImage( off_img.getImage(), x2, y2 );

	// オフスクリーンに描画
	off_paint( g );

	if( touch ){
		g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
		g.drawLine( touch_sx, touch_sy, touch_ex, touch_ey );
	}
	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 24, "ＭＳ ゴシック" );
	g.drawString( "" + ((_elapse + 1) * 1000 / (currentTimeMillis() - _time)), 0, g.fontHeight() );
	g.drawString( "" + object.size(), 0, g.fontHeight() * 2 );

	_elapse++;
}

function processEvent( type, param ){
	switch( type ){
	case _TOUCH_START_EVENT:
		touch_sx = getTouchX( 0 );
		touch_sy = getTouchY( 0 );
		touch_ex = touch_sx;
		touch_ey = touch_sy;
		touch = true;
		break;
	case _TOUCH_MOVE_EVENT:
		if( touch ){
			touch_ex = getTouchX( 0 );
			touch_ey = getTouchY( 0 );
		}
		break;
	case _TOUCH_END_EVENT:
		if( touch ){
			touch_ex = getTouchX( 0 );
			touch_ey = getTouchY( 0 );
			touch = false;
			object.addElement( new MainObject(
				touch_ex,
				touch_ey,
				touch_sx - touch_ex,
				touch_sy - touch_ey
				) );
		}
		break;
	}
}

function error(){
	launch( "error.html" );
}
