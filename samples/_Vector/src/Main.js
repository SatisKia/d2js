#include "_Graphics.js"
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

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_KEY = true;
	_USE_MOUSE = true;
	_USE_REQUESTANIMATIONFRAME = true;
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

	key_press = -1;
	key_release = -1;

	mouse = false;

	_elapse = 0;
	_time = currentTimeMillis();

	return true;
}

function paint( g ){
	var i;
	var tmp;

	for( i = 0; i < object.size(); i++ ){
		tmp = object.elementAt( i );
		tmp.update();
	}

	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );
	for( i = 0; i < object.size(); i++ ){
		tmp = object.elementAt( i );
		tmp.draw( g );
	}
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
