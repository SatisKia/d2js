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
	removeMouseEvent();

	var _canvas = setCanvas( document.getElementById( id ) );
	_gl = _canvas.getContext( "webgl" );
	initLock();

	if( id2D != undefined ){
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

	init3D( _gl, _glu );
	if( _3d != null ){
		init2D();
	}
	setRepaintFunc( repaint3D );
}

var repaint3D = function(){
	paint3D( _gl, _glu );

	if( _3d != null ){
		getCurrentContext().clearRect( 0, 0, getWidth(), getHeight() );
		getCurrentContext().save();
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
function _loadShader( type, source ){
	var shader = _gl.createShader( type );

	// シェーダーオブジェクトにソースを送信
	_gl.shaderSource( shader, source );

	// シェーダープログラムをコンパイル
	_gl.compileShader( shader );

	// コンパイルが成功したか確認する
	if( !_gl.getShaderParameter( shader, _gl.COMPILE_STATUS ) ){
		_gl.deleteShader( shader );
		return null;
	}

	return shader;
}
function createShaderProgram( vsSource, fsSource ){
	var vertexShader = _loadShader( _gl.VERTEX_SHADER, vsSource );
	var fragmentShader = _loadShader( _gl.FRAGMENT_SHADER, fsSource );

	// シェーダーの作成
	var shaderProgram = _gl.createProgram();
	_gl.attachShader( shaderProgram, vertexShader );
	_gl.attachShader( shaderProgram, fragmentShader );
	_gl.linkProgram( shaderProgram );

	// シェーダーの作成に失敗した場合、アラートを出す
	if( !_gl.getProgramParameter( shaderProgram, _gl.LINK_STATUS ) ){
		return null;
	}

	return shaderProgram;
}

//function init3D( gl, glu ){}
//function paint3D( gl, glu ){}
//function init2D(){}
//function paint2D( g ){}
