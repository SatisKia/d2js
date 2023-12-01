/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function canUseWebGL(){
	var canvas = document.createElement( "canvas" );
	var context = canvas.getContext( "webgl" );
	return (context != null);
}

var _gl;
var _glu;

var _3d = null;

function setCurrent3D( id, id2D ){
	// マウスイベント
	if( _USE_MOUSE && (_canvas != null) ){
		_removeEventListener( _canvas, "mousedown", _onMouseDown );
		_removeEventListener( _canvas, "mousemove", _onMouseMove );
		_removeEventListener( _canvas, "mouseout", _onMouseOut );
		_removeEventListener( _canvas, "mouseover", _onMouseOver );
		_removeEventListener( _canvas, "mouseup", _onMouseUp );
	}

	_canvas = document.getElementById( id );
	_gl = _canvas.getContext( "webgl" );
	_lock = false;

	if( id2D != undefined ){
		_3d = _canvas;
		_canvas = document.getElementById( id2D );
		_context = _canvas.getContext( "2d" );

		_canvas.width = _3d.width;
		_canvas.height = _3d.height;
		_context.textAlign = "left";
		_context.textBaseline = "bottom";

		_g = new _Graphics();
	}

	// マウスイベント
	if( _USE_MOUSE ){
		_addEventListener( _canvas, "mousedown", _onMouseDown );
		_addEventListener( _canvas, "mousemove", _onMouseMove );
		_addEventListener( _canvas, "mouseout", _onMouseOut );
		_addEventListener( _canvas, "mouseover", _onMouseOver );
		_addEventListener( _canvas, "mouseup", _onMouseUp );
	}

	_glu = new _GLUtility( _gl );

	init3D( _gl, _glu );
	if( _3d != null ){
		init2D();
	}
	window.repaint = function(){
		paint3D( _gl, _glu );

		if( _3d != null ){
			_context.clearRect( 0, 0, getWidth(), getHeight() );
			_context.save();
			paint2D( _g );
			_context.restore();
		}
	};
}

function getCurrent3D(){
	return (_3d == null) ? _canvas : _3d;
}

function getCurrentContext3D(){
	return _gl;
}

function setCanvas3DSize( _width, _height ){
	getCurrent3D().width = _width;
	getCurrent3D().height = _height;
}

//function init3D( gl, glu ){}
//function paint3D( gl, glu ){}
//function init2D(){}
//function paint2D( g ){}
