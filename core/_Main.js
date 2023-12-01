/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

window._USE_AUDIOEX					= false;
window._USE_DRAWSTRINGEX			= false;
window._USE_EXCANVAS				= false;

window._USE_KEY						= false;
window._USE_MOUSE					= false;
window._USE_TOUCH					= false;

window._USE_LAYOUTMOUSE				= false;
window._USE_LAYOUTTOUCH				= false;

window._USE_REQUESTANIMATIONFRAME	= false;

function canUseCanvas(){
	return (!!document.createElement( "canvas" ).getContext);
}

var _kill_timer = false;
var _start_time;
var _end_time;
var _sleep_time;

var _canvas = null;
var _context;
var _lock;

var _g;

// キー関連
var _key = 0;
var _key_array;

// レイアウト関連
var _use_layout = false;
var _layout = new Array();

// マウス関連
var _mouse_x;
var _mouse_y;

// タッチ関連
var _touch_start = false;
var _touch_x = new Array();
var _touch_y = new Array();
var _touch_x0;
var _touch_y0;

// 描画関連
var _color;
var _font_size;
var _font_family;
var _stringex = new Array();
var _stringex_num;

// stringWidth用
var _text;
var _text_style = "visibility:hidden;position:absolute;left:0;top:0";

function d2js_onload(){
	// キー関連
	_key_array = new Array();
	_key_array[ 0] = _KEY_BACKSPACE;
	_key_array[ 1] = _KEY_TAB;
	_key_array[ 2] = _KEY_ENTER;
	_key_array[ 3] = _KEY_SHIFT;
	_key_array[ 4] = _KEY_CTRL;
	_key_array[ 5] = _KEY_SPACE;
	_key_array[ 6] = _KEY_LEFT;
	_key_array[ 7] = _KEY_UP;
	_key_array[ 8] = _KEY_RIGHT;
	_key_array[ 9] = _KEY_DOWN;
	_key_array[10] = _KEY_0;
	_key_array[11] = _KEY_1;
	_key_array[12] = _KEY_2;
	_key_array[13] = _KEY_3;
	_key_array[14] = _KEY_4;
	_key_array[15] = _KEY_5;
	_key_array[16] = _KEY_6;
	_key_array[17] = _KEY_7;
	_key_array[18] = _KEY_8;
	_key_array[19] = _KEY_9;
	_key_array[20] = _KEY_C;
	_key_array[21] = _KEY_X;
	_key_array[22] = _KEY_Z;

	// アプリの開始前設定
	init();

	if( _USE_EXCANVAS || canUseCanvas() ){
		if( _USE_LAYOUTMOUSE ){
			_use_layout = true;
			_USE_MOUSE = true;
		}
		if( _USE_LAYOUTTOUCH ){
			_use_layout = true;
			_USE_TOUCH = true;
		}

		// キーイベント
		if( _USE_KEY ){
			_addEventListener( document, "keydown", _onKeyDown );
			_addEventListener( document, "keyup", _onKeyUp );
		}

		// タッチイベント
		if( _USE_TOUCH ){
			_addEventListener( document, "touchstart", _onTouchStart );
			_addEventListener( document, "touchmove", _onTouchMove );
			_addEventListener( document, "touchend", _onTouchEnd );
		}

		// stringWidth用
		_text = document.createElement( "span" );
		_text.style.cssText = _text_style;
		document.body.appendChild( _text );

		// アプリの開始
		if( start() ){
			setTimer();
		}
	} else {
		error();
	}
}

function d2js_onorientationchange(){
	processEvent( _ORIENTATIONCHANGE_EVENT, window.orientation );
}

function d2js_onresize(){
	processEvent( _RESIZE_EVENT, 0 );
}

function setTimer(){
	_kill_timer = false;
	_loop();
}

function killTimer(){
	_kill_timer = true;
}

function repaint(){
	if( _USE_DRAWSTRINGEX ){
		_stringex_num = 0;
	}

	_context.clearRect( 0, 0, getWidth(), getHeight() );
	_context.save();
	paint( _g );
	_context.restore();

	if( _USE_DRAWSTRINGEX ){
		for( var i = _stringex_num; i < _stringex.length; i++ ){
			_stringex[i].innerHTML = "";
		}
	}
}

function _getSleepTime(){
	_sleep_time = frameTime() - (_end_time - _start_time);
	if( _sleep_time < 0 ){
		_sleep_time = 0;
	}
	if( _sleep_time > frameTime() ){
		_sleep_time = frameTime();
	}
}
function _sleep(){
	while( (_end_time > _start_time) && ((_end_time - _start_time) < frameTime()) ){
		_end_time = currentTimeMillis();
	}
}
function _loop(){
	if( _kill_timer ){
		_kill_timer = false;
		return;
	}
	_start_time = currentTimeMillis();
	repaint();
	_end_time = currentTimeMillis();
	if( _USE_REQUESTANIMATIONFRAME ){
		if( !!window.requestAnimationFrame ){
			_sleep();
			window.requestAnimationFrame( _loop );
		} else if( !!window.webkitRequestAnimationFrame ){
			_sleep();
			window.webkitRequestAnimationFrame( _loop );
		} else if( !!window.mozRequestAnimationFrame ){
			_sleep();
			window.mozRequestAnimationFrame( _loop );
		} else if( !!window.oRequestAnimationFrame ){
			_sleep();
			window.oRequestAnimationFrame( _loop );
		} else if( !!window.msRequestAnimationFrame ){
			_sleep();
			window.msRequestAnimationFrame( _loop );
		} else {
			_getSleepTime();
			window.setTimeout( _loop, _sleep_time );
		}
	} else {
		_getSleepTime();
		window.setTimeout( _loop, _sleep_time );
	}
}

function _addEventListener( target, event, func ){
	if( !!target.addEventListener ){
		target.addEventListener( event, func, false );
	} else if( !!target.attachEvent ){
		target.attachEvent( "on" + event, func );
	} else {
		target["on" + event] = func;
	}
}
function _removeEventListener( target, event, func ){
	if( !!target.removeEventListener ){
		target.removeEventListener( event, func, false );
	} else if( !!target.detachEvent ){
		target.detachEvent( "on" + event, func );
	} else {
		target["on" + event] = null;
	}
}

function setCurrent( id ){
	_canvas = document.getElementById( id );
	_context = _canvas.getContext( "2d" );
	_lock = false;

	_context.textAlign = "left";
	_context.textBaseline = "bottom";

	_g = new _Graphics();

	// マウスイベント
	if( _USE_MOUSE ){
		_addEventListener( _canvas, "mousedown", _onMouseDown );
		_addEventListener( _canvas, "mousemove", _onMouseMove );
		_addEventListener( _canvas, "mouseout", _onMouseOut );
		_addEventListener( _canvas, "mouseover", _onMouseOver );
		_addEventListener( _canvas, "mouseup", _onMouseUp );
	}
}
function setGraphics( g ){
	_g = g;
}

function getCurrent(){
	return _canvas;
}
function getCurrentContext(){
	return _context;
}
function getGraphics(){
	return _g;
}

function setCanvasSize( _width, _height ){
	_canvas.width = _width;
	_canvas.height = _height;
	_context.textAlign = "left";
	_context.textBaseline = "bottom";
}

function getWidth(){
	return parseInt( _canvas.width );//_canvas.offsetWidth;
}
function getHeight(){
	return parseInt( _canvas.height );//_canvas.offsetHeight;
}

function _getLeft( e ){
	var left = 0;
	while( e ){
		left += e.offsetLeft;
		e = e.offsetParent;
	}
	return left;
}
function _getTop( e ){
	var top = 0;
	while( e ){
		top += e.offsetTop;
		e = e.offsetParent;
	}
	return top;
}

function getBrowserWidth(){
	if( (!!document.documentElement) && (document.documentElement.clientWidth > 0) ){
		return document.documentElement.clientWidth;
	} else if( !!document.body ){
		return document.body.clientWidth;
	} else if( !!window.innerWidth ){
		return window.innerWidth;
	}
	return 0;
}
function getBrowserHeight(){
	if( (!!document.documentElement) && (document.documentElement.clientHeight > 0) ){
		return document.documentElement.clientHeight;
	} else if( !!document.body ){
		return document.body.clientHeight;
	} else if( !!window.innerHeight ){
		return window.innerHeight;
	}
	return 0;
}

function getOrientation(){
	return window.orientation;
}

function readParameter( text, key ){
	var ret = "";
	var start = text.indexOf( "?" + key + "=" );
	if( start < 0 ){
		start = text.indexOf( "&" + key + "=" );
	}
	if( start >= 0 ){
		start += key.length + 2;
		var end = text.indexOf( "&", start );
		if( end < 0 ){
			end = text.length;
		}
		ret = text.substring( start, end );
	}
	return decodeURIComponent( ret );
}
function readParameters( text ){
	var params = text.split( "&" );
	var key = new Array();
	for( var i = 0; i < params.length; i++ ){
		var param = params[i].split( "=" );
		key[param[0]] = decodeURIComponent( param[1] );
	}
	return key;
}

function getParameter( key ){
	return readParameter( location.href, key );
}

function getResImage( id ){
	return document.getElementById( id );
}
function getResString( id ){
	var str = document.getElementById( id ).innerHTML;
	str = str.replace( new RegExp( "&lt;", "igm" ), "<" );
	str = str.replace( new RegExp( "&gt;", "igm" ), ">" );
	return str;
}

function currentTimeMillis(){
	return (new Date()).getTime();
}

function setKeyArray( array ){
	var len = array.length;
	_key_array = new Array();
	for( var i = 0; i < len; i++ ){
		_key_array[i] = array[i];
	}
}
function keyBit( key ){
	var len = _key_array.length;
	for( var i = 0; i < len; i++ ){
		if( _key_array[i] == key ){
			return (1 << i);
		}
	}
	return 0;
}
function _onKeyDown( e ){
	var k = keyBit( e.keyCode );
	if( (_key & k) == 0 ){
		_key += k;
	}
	processEvent( _KEY_PRESSED_EVENT, e.keyCode );
}
function _onKeyUp( e ){
	var k = keyBit( e.keyCode );
	if( (_key & k) != 0 ){
		_key -= k;
	}
	processEvent( _KEY_RELEASED_EVENT, e.keyCode );
}

function getKeypadState(){
	return _key;
}

function __MainLayout( x, y, width, height, id ){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.id = id;
	this.shape = null;
	this.coords = null;
}
function clearLayout(){
	_layout = new Array();
}
function addLayout( x, y, w, h, id ){
	_layout[_layout.length] = new __MainLayout( x, y, w, h, id );
}
function addLayoutArea( x, y, width, height, id, shape, coords ){
	addLayout( x, y, width, height, id );
	if( !!_context.isPointInPath ){
		_layout[_layout.length - 1].shape = shape;
		var tmp = coords.split( "," );
		_layout[_layout.length - 1].coords = new Array( tmp.length );
		for( var i = 0; i < tmp.length; i++ ){
			_layout[_layout.length - 1].coords[i] = parseInt( tmp[i] );
		}
	}
}
function getLayout( id ){
	if( _layout.length > 0 ){
		for( var i = 0; i < _layout.length; i++ ){
			if( _layout[i].id == id ){
				return _layout[i];
			}
		}
	}
	return null;
}
function checkLayout( x, y ){
	if( _layout.length > 0 ){
		for( var i = 0; i < _layout.length; i++ ){
			if( _layout[i].shape == null ){
				if(
					(x >= _layout[i].x) &&
					(x < _layout[i].x + _layout[i].width) &&
					(y >= _layout[i].y) &&
					(y < _layout[i].y + _layout[i].height)
				){
					return _layout[i].id;
				}
			} else {
				_context.beginPath();
				if( _layout[i].shape == "circle" ){
					_context.arc(
						_layout[i].x + _layout[i].coords[0],
						_layout[i].y + _layout[i].coords[1],
						_layout[i].coords[2],
						0.0, Math.PI * 2.0, false
						);
				} else if( _layout[i].shape == "poly" ){
					_context.moveTo(
						_layout[i].x + _layout[i].coords[0],
						_layout[i].y + _layout[i].coords[1]
						);
					for( var j = 2; j < _layout[i].coords.length - 1; j += 2 ){
						_context.lineTo(
							_layout[i].x + _layout[i].coords[j],
							_layout[i].y + _layout[i].coords[j + 1]
							);
					}
					_context.closePath();
				} else if( _layout[i].shape == "rect" ){
					_context.moveTo( _layout[i].x + _layout[i].coords[0], _layout[i].y + _layout[i].coords[1] );
					_context.lineTo( _layout[i].x + _layout[i].coords[2], _layout[i].y + _layout[i].coords[1] );
					_context.lineTo( _layout[i].x + _layout[i].coords[2], _layout[i].y + _layout[i].coords[3] );
					_context.lineTo( _layout[i].x + _layout[i].coords[0], _layout[i].y + _layout[i].coords[3] );
					_context.closePath();
				}
				if( _context.isPointInPath( x, y ) ){
					return _layout[i].id;
				}
			}
		}
	}
	return -1;
}

function getLayoutState(){
	var ret = 0;
	var id;
	for( var i = 0; i < _touch_x.length; i++ ){
		id = checkLayout( _touch_x[i], _touch_y[i] );
		if( id >= 0 ){
			ret |= (1 << id);
		}
	}
	return ret;
}
function layoutBit( id ){
	return (1 << id);
}

function _getMouse( e ){
	_mouse_x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - _getLeft( _canvas );
	_mouse_y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop - _getTop( _canvas );
}
function _onMouseDown( e ){
	_getMouse( e );
	if( _use_layout ){
		if( _layout.length > 0 ){
			var p = checkLayout( _mouse_x, _mouse_y );
			if( p >= 0 ){
				processEvent( _LAYOUT_DOWN_EVENT, p );
				return;
			}
		}
	}
	processEvent( _MOUSE_DOWN_EVENT, 0 );
}
function _onMouseMove( e ){
	_getMouse( e );
	processEvent( _MOUSE_MOVE_EVENT, 0 );
}
function _onMouseOut( e ){
	_getMouse( e );
	processEvent( _MOUSE_OUT_EVENT, 0 );
}
function _onMouseOver( e ){
	_getMouse( e );
	processEvent( _MOUSE_OVER_EVENT, 0 );
}
function _onMouseUp( e ){
	_getMouse( e );
	if( _use_layout ){
		if( _layout.length > 0 ){
			var p = checkLayout( _mouse_x, _mouse_y );
			if( p >= 0 ){
				processEvent( _LAYOUT_UP_EVENT, p );
				return;
			}
		}
	}
	processEvent( _MOUSE_UP_EVENT, 0 );
}

function getMouseX(){
	return _mouse_x;
}
function getMouseY(){
	return _mouse_y;
}

function _getTouch( e ){
	_touch_x = new Array();
	_touch_y = new Array();
	for( var i = 0; i < e.touches.length; i++ ){
		_touch_x[i] = e.touches[i].pageX - _getLeft( _canvas );
		_touch_y[i] = e.touches[i].pageY - _getTop( _canvas );
	}
}
function _onTouchStart( e ){
	_getTouch( e );
	_touch_x0 = _touch_x[0];
	_touch_y0 = _touch_y[0];
	if( (_touch_x0 >= 0) && (_touch_x0 < getWidth()) && (_touch_y0 >= 0) && (_touch_y0 < getHeight()) ){
		_touch_start = true;
		if( _use_layout ){
			if( _layout.length > 0 ){
				var p = checkLayout( _touch_x0, _touch_y0 );
				if( p >= 0 ){
					processEvent( _LAYOUT_DOWN_EVENT, p );
					e.preventDefault();
					return;
				}
			}
		}
		processEvent( _TOUCH_START_EVENT, 0 );
		e.preventDefault();
	}
}
function _onTouchMove( e ){
	if( _touch_start ){
		_getTouch( e );
		_touch_x0 = _touch_x[0];
		_touch_y0 = _touch_y[0];
		processEvent( _TOUCH_MOVE_EVENT, 0 );
		e.preventDefault();
	}
}
function _onTouchEnd( e ){
	if( _touch_start ){
		_touch_start = false;
		_getTouch( e );
		if( _use_layout ){
			if( _layout.length > 0 ){
				var p = checkLayout( _touch_x0, _touch_y0 );
				if( p >= 0 ){
					processEvent( _LAYOUT_UP_EVENT, p );
					e.preventDefault();
					return;
				}
			}
		}
		processEvent( _TOUCH_END_EVENT, 0 );
		e.preventDefault();
	}
}

function touchNum(){
	return _touch_x.length;
}
function getTouchX( index ){
	return ((index < _touch_x.length) ? _touch_x[index] : _touch_x0);
}
function getTouchY( index ){
	return ((index < _touch_y.length) ? _touch_y[index] : _touch_y0);
}

function launch( url ){
	location.replace( url );
}

function setFont( size, family ){
	_font_size = size;
	_font_family = (family.indexOf( " " ) >= 0) ? "'" + family + "'" : family;
	_text.style.cssText = _text_style + ";font:" + _font_size + "px " + _font_family;
}
function stringWidth( str ){
	_text.innerHTML = "'";
	var tmp = _text.offsetWidth;
	str = str.replace( new RegExp( "<", "igm" ), "&lt;" );
	str = str.replace( new RegExp( ">", "igm" ), "&gt;" );
	_text.innerHTML = "'" + str + "'";
	return _text.offsetWidth - tmp * 2;
}
function fontHeight(){
	return _font_size;
}

function _drawStringEx( str, x, y ){
	if( _lock ){
		return;
	}
	if( _stringex_num >= _stringex.length ){
		_stringex[_stringex_num] = document.createElement( "span" );
		_stringex[_stringex_num].style.cssText = "position:absolute";
		document.body.appendChild( _stringex[_stringex_num] );

		// マウスイベント
		if( _USE_MOUSE ){
			_addEventListener( _stringex[_stringex_num], "mousedown", _onMouseDown );
			_addEventListener( _stringex[_stringex_num], "mousemove", _onMouseMove );
			_addEventListener( _stringex[_stringex_num], "mouseup", _onMouseUp );
		}
	}
	_stringex[_stringex_num].style.cssText = "position:absolute;left:" + (_getLeft( _canvas ) + x) + "px;top:" + (_getTop( _canvas ) + y - _font_size) + "px;color:" + _color + ";font:" + _font_size + "px " + _font_family;
	str = str.replace( new RegExp( "<", "igm" ), "&lt;" );
	str = str.replace( new RegExp( ">", "igm" ), "&gt;" );
	_stringex[_stringex_num].innerHTML = str;
	_stringex_num++;
}

//function frameTime(){ return 16/*1000 / 60*/; }

//function init(){}
//function start(){ return true; }
//function paint( g ){}
//function processEvent( type, param ){}
//function error(){}
