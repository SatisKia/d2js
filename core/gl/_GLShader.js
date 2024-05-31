/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

// コンストラクタ
function _GLShader( vsSource, fsSource ){
	this._program = createShaderProgram( vsSource, fsSource );
}

// メソッド
_GLShader.prototype = {

	attrib : function( name ){
		return _gl.getAttribLocation( this._program, name );
	},

	uniform : function( name ){
		return _gl.getUniformLocation( this._program, name );
	},

	use : function(){
		_gl.useProgram( this._program );
	}

};

// 静的メソッド
_GLShader.bindPositionBuffer = function( attrib ){
	_gl.vertexAttribPointer( attrib, 3, _gl.FLOAT, false, 0, 0 );
	_gl.enableVertexAttribArray( attrib );
};
_GLShader.bindNormalBuffer = function( attrib ){
	_gl.vertexAttribPointer( attrib, 3, _gl.FLOAT, false, 0, 0 );
	_gl.enableVertexAttribArray( attrib );
};
_GLShader.bindColorBuffer = function( attrib ){
	_gl.vertexAttribPointer( attrib, 4, _gl.FLOAT, false, 0, 0 );
	_gl.enableVertexAttribArray( attrib );
};
_GLShader.bindTextureCoordBuffer = function( attrib ){
	_gl.vertexAttribPointer( attrib, 2, _gl.FLOAT, false, 0, 0 );
	_gl.enableVertexAttribArray( attrib );
};
