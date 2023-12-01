#include "_Audio.js"
#include "_Graphics.js"
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

var sound;
var sound_loaded;

var _elapse;	// 経過時間
var _time;		//

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_AUDIOEX = false;
	_USE_REQUESTANIMATIONFRAME = true;
	_USE_TOUCH = true;
}

function loadSound(){
	sound = loadAudio( SOUND_SRC );
}
function playSound(){
	if( sound != null ){
		playAudio( sound, false );
	}
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

	sound = null;
	sound_loaded = false;

	_elapse = 0;
	_time = currentTimeMillis();

	repaint();	// 手動で paint 指示

	return false;	// タイマーによる paint 呼び出しを行わない
}

function paint( g ){
	var i;
	var tmp;

	if( !sound_loaded ){
		g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
		g.fillRect( 0, 0, getWidth(), getHeight() );
		g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
		g.setFont( 24, "ＭＳ ゴシック" );
		g.drawString( "タップしてください", 0, g.fontHeight() );
		return;
	}

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
	if( !sound_loaded ){
		if( type == _TOUCH_END_EVENT ){
			loadSound();

			sound_loaded = true;

			_time = currentTimeMillis();

			setTimer();	// タイマーによる paint 呼び出し開始
		}
		return;
	}

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
				(touch_sx - touch_ex) / 10,
				(touch_sy - touch_ey) / 10
				) );
		}
		break;
	}
}

function error(){
	launch( "error.html" );
}
