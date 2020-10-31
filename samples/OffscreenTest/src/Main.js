#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"
#include "_Random.js"
#include "_Vector.js"

#include "MainObject.js"

var rand;
var object;

var key_press;
var key_release;

var mouse_sx;
var mouse_sy;
var mouse_ex;
var mouse_ey;
var mouse;

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
	_USE_KEY = true;
	_USE_LOCKIMAGE = true;
	_USE_MOUSE = true;
}

function start(){
	setCurrent( "canvas0" );

	rand = new _Random();
	object = new _Vector( 128 );

	key_press = -1;
	key_release = -1;

	mouse = false;

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
		tmp.draw();
	}

	// キャンバスにオフスクリーンイメージを描画
	g.drawImage( off_img.getImage(), x2, y2 );

	// オフスクリーンに描画
	off_paint( g );

	if( mouse ){
		g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
		g.drawLine( mouse_sx, mouse_sy, mouse_ex, mouse_ey );
	}
	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 24, "ＭＳ ゴシック" );
	g.drawString( "" + ((_elapse + 1) * 1000 / (currentTimeMillis() - _time)), 0, g.fontHeight() );
	g.drawString( "" + object.size(), 0, g.fontHeight() * 2 );
	g.drawString( "key " + getKeypadState(), 0, getHeight() - g.fontHeight() * 2 );
	g.drawString( "press " + key_press, 0, getHeight() - g.fontHeight() );
	g.drawString( "release " + key_release, 0, getHeight() );

	_elapse++;
}

function processEvent( type, param ){
	switch( type ){
	case _KEY_PRESSED_EVENT:
		key_press = param;
		object.addElement( new MainObject(
			(getWidth () / 2) + (rand.nextInt() % (getWidth () / 2)),
			(getHeight() / 2) + (rand.nextInt() % (getHeight() / 2)),
			rand.nextInt() % 10,
			rand.nextInt() % 10
			) );
		break;
	case _KEY_RELEASED_EVENT:
		key_release = param;
		break;
	case _MOUSE_DOWN_EVENT:
		mouse_sx = getMouseX();
		mouse_sy = getMouseY();
		mouse_ex = mouse_sx;
		mouse_ey = mouse_sy;
		mouse = true;
		break;
	case _MOUSE_MOVE_EVENT:
		if( mouse ){
			mouse_ex = getMouseX();
			mouse_ey = getMouseY();
		}
		break;
	case _MOUSE_OUT_EVENT:
		mouse = false;
		break;
	case _MOUSE_UP_EVENT:
		if( mouse ){
			mouse_ex = getMouseX();
			mouse_ey = getMouseY();
			mouse = false;
			object.addElement( new MainObject(
				mouse_ex,
				mouse_ey,
				mouse_sx - mouse_ex,
				mouse_sy - mouse_ey
				) );
		}
		break;
	}
}

function error(){
	launch( "error.html" );
}
