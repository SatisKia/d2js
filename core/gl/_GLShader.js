/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

// コンストラクタ
function _GLShader( vsSource, fsSource, useVars ){
	if( typeof glShaderError != 'undefined' ){
		this._program = createShaderProgram( vsSource, fsSource, glShaderError );
	} else {
		this._program = createShaderProgram( vsSource, fsSource );
	}

	if( (useVars != undefined) && (useVars == true) ){
		var i, j;
		var tmp, tmp2, tmp3, tmp4, tmp5;
		var type;
		var top, end;
		var name;
		this.vars = [];
		for( j = 0; j < 2; j++ ){
			tmp = "" + ((j == 0) ? vsSource : fsSource);
			for( i = 0; i < 2; i++ ){
				type = ((i == 0) ? "attribute" : "uniform");
				while( true ){
					if( (top = tmp.indexOf( type )) >= 0 ){
						tmp2 = tmp.substring( top );
						if( (end = tmp2.indexOf( ";" )) >= 0 ){
							name = "";
							tmp3 = tmp2.substring( 0, end );
							tmp4 = tmp3.split( "\t" );
							if( tmp4.length > 0 ){
								tmp5 = tmp4[tmp4.length - 1].split( " " );
								if( tmp5.length > 0 ){
									name = tmp5[tmp5.length - 1];
								} else {
									name = tmp4[tmp4.length - 1];
								}
							} else {
								tmp4 = tmp3.split( " " );
								if( tmp4.length > 0 ){
									name = tmp4[tmp4.length - 1];
								}
							}
							if( name.length > 0 ){
								if( i == 0 ){
									this.vars[name] = _gl.getAttribLocation( this._program, name );
								} else {
									this.vars[name] = _gl.getUniformLocation( this._program, name );
								}
							}
							if( end + 1 >= tmp.length ){
								break;
							}
							tmp = tmp.substring( end + 1 );
						} else {
							break;
						}
					} else {
						break;
					}
				}
			}
		}
	}
}

// メソッド
_GLShader.prototype = {

	attrib : function( name ){
		if( this.vars != undefined ){
			return this.vars[name];
		}
		return _gl.getAttribLocation( this._program, name );
	},

	uniform : function( name ){
		if( this.vars != undefined ){
			return this.vars[name];
		}
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
_GLShader.setIndexBuffer = function( buffer, indices ){
	_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, buffer );
	_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), _gl.STATIC_DRAW );
	_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, null);
};
_GLShader.setArrayBuffer = function( buffer, data ){
	_gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
	_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( data ), _gl.STATIC_DRAW );
	_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
};
_GLShader.bindArrayBuffer = function( attrib, buffer, param1, param2 ){
	var stride = (param2 == undefined) ? param1 : param2;
	_gl.bindBuffer( _gl.ARRAY_BUFFER, buffer );
	if( param2 != undefined ){
		_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( param1 ), _gl.STATIC_DRAW );
	}
	_gl.vertexAttribPointer( attrib, stride, _gl.FLOAT, false, 0, 0 );
	_gl.enableVertexAttribArray( attrib );
	_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
};

//function glShaderError( type, info ){}
