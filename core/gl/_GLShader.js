/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLShader( vsSource, fsSource ){
	this._program = createShaderProgram( vsSource, fsSource );
}

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
