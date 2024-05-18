/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_GLPrimitive.h"

function _GLSprite( id, depth ){
	this._glp = new _GLPrimitive();
	this._glp.setType( _GLPRIMITIVE_TYPE_SPRITE );
	this._glp.setDepth( depth );

	this._id = id;

	this._coord = new Array( 12 );
	this._map = new Array( 8 );
	this._uv = new Array( 8 );
	this._uv_f = true;

	this._coord_buffer = _gl.createBuffer();
	this._uv_buffer = _gl.createBuffer();

	this._coord[0] = -1.0; this._coord[ 1] = -1.0; this._coord[ 2] = 0.0;
	this._coord[3] =  1.0; this._coord[ 4] = -1.0; this._coord[ 5] = 0.0;
	this._coord[6] = -1.0; this._coord[ 7] =  1.0; this._coord[ 8] = 0.0;
	this._coord[9] =  1.0; this._coord[10] =  1.0; this._coord[11] = 0.0;

	this._uv[0] = 0.0; this._uv[1] = 1.0;
	this._uv[2] = 1.0; this._uv[3] = 1.0;
	this._uv[4] = 0.0; this._uv[5] = 0.0;
	this._uv[6] = 1.0; this._uv[7] = 0.0;
}

_GLSprite.prototype = {

	type : function(){
		return this._glp.type();
	},
	depth : function(){
		return this._glp.depth();
	},

	setTransparency : function( trans ){
		this._glp.setTransparency( trans );
	},
	transparency : function(){
		return this._glp.transparency();
	},

	id : function(){
		return this._id;
	},

	setCoord : function( coord ){
		for( var i = 0; i < 12; i++ ){
			this._coord[i] = coord[i];
		}
	},

	setMap : function( map, uv ){
		if( uv == undefined ){
			uv = false;
		}
		this._uv_f = uv;
		if( this._uv_f ){
			for( var i = 0; i < 8; i++ ){
				this._uv[i] = map[i];
			}
		} else {
			for( var i = 0; i < 8; i++ ){
				this._map[i] = map[i];
			}
		}
	},

	textureAlpha : function( glt/*_GLTexture*/, tex_index ){
		var alpha = false;
		var depth = this.depth();
		if( tex_index >= 0 ){
			glt.use( tex_index );
			glt.setTransparency( tex_index, this.transparency() );
			alpha = glt.alpha( tex_index );
		}
		return (alpha && !depth);
	},

	draw : function( glt/*_GLTexture*/, tex_index, alpha ){
		var alpha2 = this.textureAlpha( glt, tex_index );
		if( this.transparency() != 1.0 ){
			alpha2 = true;
		}
		if( alpha2 != alpha ){
			return;
		}

		_gl.bindBuffer( _gl.ARRAY_BUFFER, this._coord_buffer );
		_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( this._coord ), _gl.STATIC_DRAW );
		glSpriteBindPositionBuffer( _gl, this._id );
		_gl.bindBuffer( _gl.ARRAY_BUFFER, null );

		if( !this._uv_f ){
			var width  = glt.width( tex_index );
			var height = glt.height( tex_index );
			for( var i = 0; i < 4; i++ ){
				this._uv[i * 2    ] = this._map[i * 2    ] / width;
				this._uv[i * 2 + 1] = this._map[i * 2 + 1] / height;
			}
		}
		_gl.bindBuffer( _gl.ARRAY_BUFFER, this._uv_buffer );
		_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( this._uv ), _gl.STATIC_DRAW );
		glSpriteBindTextureCoordBuffer( _gl, this._id );
		_gl.bindBuffer( _gl.ARRAY_BUFFER, null );

		if( !glSpriteSetTexture( _gl, glt, tex_index, this._id ) ){
			if( tex_index >= 0 ){
				_gl.activeTexture( glSpriteActiveTexture( _gl, this._id ) );
				glt.bindTexture( _gl.TEXTURE_2D, glt.id( tex_index ) );
//				_gl.texEnvf( _gl.TEXTURE_ENV, _gl.TEXTURE_ENV_MODE, _gl.REPLACE );
			}
		}

//		if( glt.alpha( tex_index ) ){
//			_gl.enable( _gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			_gl.disable( _gl.CULL_FACE );
			_gl.enable( _gl.BLEND );
			_gl.depthMask( false );
		}

//		_gl.drawElements( _gl.TRIANGLE_STRIP, 4, _gl.UNSIGNED_BYTE, this._strip_buffer );
		_gl.drawArrays( _gl.TRIANGLE_STRIP, 0, 4 );

//		if( glt.alpha( tex_index ) ){
//			_gl.disable( _gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			_gl.enable( _gl.CULL_FACE );
			_gl.disable( _gl.BLEND );
			_gl.depthMask( true );
		}
	}

};

//function glSpriteActiveTexture( gl, id ){ return gl.TEXTURE0; }
//function glSpriteBindPositionBuffer( gl, id ){}
//function glSpriteBindTextureCoordBuffer( gl, id ){}
//function glSpriteSetTexture( gl, glt/*_GLTexture*/, tex_index, id ){ return false; }
