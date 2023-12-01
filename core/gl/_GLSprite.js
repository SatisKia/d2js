/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLSprite( gl, depth ){
	this._glp = new _GLPrimitive();
	this._glp.setType( _GLPRIMITIVE_TYPE_SPRITE );
	this._glp.setDepth( depth );

	this._coord = new Array( 12 );
	this._map = new Array( 8 );
	this._uv = new Array( 8 );
	this._uv_f = true;

	this._coord_buffer = gl.createBuffer();
	this._uv_buffer = gl.createBuffer();

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
		glt.use( tex_index );
		glt.setTransparency( tex_index, this._glp.transparency() );
		return (glt.alpha( tex_index ) && !this._glp.depth());
	},

	draw : function( gl, glt/*_GLTexture*/, tex_index, alpha ){
		var alpha2 = this.textureAlpha( glt, tex_index );
		if( this._glp.transparency() != 255 ){
			alpha2 = true;
		}
		if( alpha2 != alpha ){
			return;
		}

		gl.bindBuffer( gl.ARRAY_BUFFER, this._coord_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._coord ), gl.STATIC_DRAW );
		glSpriteBindPositionBuffer( gl );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );

		if( !this._uv_f ){
			var width  = glt.width( tex_index );
			var height = glt.height( tex_index );
			for( var i = 0; i < 4; i++ ){
				this._uv[i * 2    ] = this._map[i * 2    ] / width;
				this._uv[i * 2 + 1] = this._map[i * 2 + 1] / height;
			}
		}
		gl.bindBuffer( gl.ARRAY_BUFFER, this._uv_buffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._uv ), gl.STATIC_DRAW );
		glSpriteBindTextureCoordBuffer( gl );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );

		gl.activeTexture( gl.TEXTURE0 );
		glt.bindTexture( gl.TEXTURE_2D, glt.id( tex_index ) );
//		gl.texEnvf( gl.TEXTURE_ENV, gl.TEXTURE_ENV_MODE, gl.REPLACE );

//		if( glt.alpha( tex_index ) ){
//			gl.enable( gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			gl.enable( gl.BLEND );
			gl.depthMask( false );
		}

//		gl.drawElements( gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_BYTE, this._strip_buffer );
		gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );

//		if( glt.alpha( tex_index ) ){
//			gl.disable( gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			gl.disable( gl.BLEND );
			gl.depthMask( true );
		}
	}

};

//function glSpriteBindPositionBuffer( gl ){}
//function glSpriteBindTextureCoordBuffer( gl ){}
