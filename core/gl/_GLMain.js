/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_GLGlobal.h"

function canUseWebGL(){
	var canvas = document.createElement( "canvas" );
	var context = canvas.getContext( "webgl" );
	return (context != null);
}

var _gl;
var _glu;

var _3d = null;

function setCurrent3D( id, id2D, stencil ){
	if( id2D == undefined ){
		id2D = "";
	}
	if( stencil == undefined ){
		stencil = false;
	}

	// マウスイベント
	removeMouseEvent();

	var _canvas = setCanvas( document.getElementById( id ) );
	if( stencil ){
		_gl = _canvas.getContext( "webgl", { stencil: true } );
	} else {
		_gl = _canvas.getContext( "webgl" );
	}
	initLock();

	if( id2D.length > 0 ){
		_3d = _canvas;
		_canvas = setCanvas( document.getElementById( id2D ) );
		var _context = setContext( _canvas.getContext( "2d" ) );

		_canvas.width = _3d.width;
		_canvas.height = _3d.height;
		_context.textAlign = "left";
		_context.textBaseline = "bottom";

		setGraphics( new _Graphics() );
	}

	// マウスイベント
	addMouseEvent();

	_glu = new _GLUtility();

	if( init3D( _gl, _glu ) ){
		if( _3d != null ){
			init2D( getGraphics() );
		}
		setRepaintFunc( repaint3D );
	} else {
		killTimer();
	}
}

var repaint3D = function(){
	if( _3d != null ){
		getCurrentContext().clearRect( 0, 0, getWidth(), getHeight() );
		getCurrentContext().save();
		clear2D( getGraphics() );
	}

	paint3D( _gl, _glu );

	if( _3d != null ){
		paint2D( getGraphics() );
		getCurrentContext().restore();
	}
};

function getCurrent3D(){
	return (_3d == null) ? getCurrent() : _3d;
}

function getCurrentContext3D(){
	return _gl;
}

function setCanvas3DSize( _width, _height ){
	getCurrent3D().width = _width;
	getCurrent3D().height = _height;
}

// シェーダーの作成
function _loadShader( type, source, errorFunc ){
	var shader = _gl.createShader( type );

	// シェーダーオブジェクトにソースを送信
	_gl.shaderSource( shader, source );

	// シェーダープログラムをコンパイル
	_gl.compileShader( shader );

	// コンパイルが成功したか確認する
	if( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ){
		if( errorFunc != undefined ){
			errorFunc( _GLSHADER_ERROR_COMPILE, _gl.getShaderInfoLog( shader ) );
		}
		_gl.deleteShader( shader );
		return null;
	}

	return shader;
}
function createShaderProgram( vsSource, fsSource, errorFunc ){
	var vertexShader = _loadShader( _gl.VERTEX_SHADER, vsSource, errorFunc );
	var fragmentShader = _loadShader( _gl.FRAGMENT_SHADER, fsSource, errorFunc );

	// シェーダーの作成
	var shaderProgram = _gl.createProgram();
	_gl.attachShader( shaderProgram, vertexShader );
	_gl.attachShader( shaderProgram, fragmentShader );
	_gl.linkProgram( shaderProgram );

	// シェーダーの作成に失敗した場合、nullを返す
	if( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ){
		if( errorFunc != undefined ){
			errorFunc( _GLSHADER_ERROR_LINK, _gl.getProgramInfoLog( shaderProgram ) );
		}
		return null;
	}

	return shaderProgram;
}

//function init3D( gl, glu ){ return true; }
//function paint3D( gl, glu ){}
//function init2D( g ){}
//function clear2D( g ){}
//function paint2D( g ){}
