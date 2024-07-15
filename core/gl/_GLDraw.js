/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_GLPrimitive.h"

function _GLDrawPrimitive( p, index, tex_index, mat, trans, sort, x, y, z ){
	this._p = p;
	this._index = index;
	this._tex_index = tex_index;
	this._mat = new Array( 16 );
	if( mat != null ){
		for( var i = 0; i < 16; i++ ){
			this._mat[i] = mat[i];
		}
	}
	this._trans = (trans >= 0.0) ? trans : p.transparency();
	this._distance = 0.0;
	if( sort ){
		var dx = x - _glu.positionX();
		var dy = y - _glu.positionY();
		var dz = z - _glu.positionZ();
		this._distance = _glu.distance( dx, dy, dz );
	}
}
_GLDrawPrimitive.prototype = {
	draw : function( glt/*_GLTexture*/, alpha ){
		switch( this._p.type() ){
		case _GLPRIMITIVE_TYPE_MODEL:
			this._p.setTransparency( this._trans );
			this._p.draw( glt, this._index, this._tex_index, alpha );
			break;
		case _GLPRIMITIVE_TYPE_SPRITE:
			this._p.setTransparency( this._trans );
			this._p.draw( glt, this._tex_index, alpha );
			break;
		}
	}
};

function _GLDraw( proj_mat ){
	var i;
	this._proj_mat = new Array( 16 );
	if( proj_mat != null ){
		for( i = 0; i < 16; i++ ){
			this._proj_mat[i] = proj_mat[i];
		}
	}
	this._draw = new Array();
}

_GLDraw.prototype = {

	clear : function(){
		this._draw = new Array();
	},

	add : function( p, index, tex_index, mat, trans ){
		if( (p.type() == _GLPRIMITIVE_TYPE_MODEL) && (index < 0) ){
			for( var i = p.stripNum() - 1; i >= 0; i-- ){
				this._draw[this._draw.length] = new _GLDrawPrimitive( p, i, tex_index, mat, trans, false );
			}
		} else {
			this._draw[this._draw.length] = new _GLDrawPrimitive( p, index, tex_index, mat, trans, false );
		}
	},

	addSprite : function( p, tex_index, x, y, z, trans ){
		var index = this._draw.length;
		this._draw[index] = new _GLDrawPrimitive( p, -1, tex_index, _glu.spriteMatrix( x, y, z ), trans, true, x, y, z );
		return this._draw[index]._distance;
	},
	addSpriteScale : function( p, tex_index, x, y, z, scale_x, scale_y, scale_z, trans ){
		var index = this._draw.length;
		_glu.spriteMatrix( x, y, z );
		_glu.scale( scale_x, scale_y, scale_z );
		this._draw[index] = new _GLDrawPrimitive( p, -1, tex_index, _glu.glMatrix(), trans, true, x, y, z );
		return this._draw[index]._distance;
	},

	draw : function( glt/*_GLTexture*/ ){
		var i, j;
		var distance;
		var tmp;

		var count = this._draw.length;

		// ソート
		var draw = new Array();
		var k = 0;
		for( i = 0; i < count; i++ ){
			if( this._draw[i]._distance == 0.0 ){
				this._draw[i]._distance = -1.0;
				draw[k++] = this._draw[i];
			}
		}
		for( ; k < count; k++ ){
			distance = 0.0;
			j = 0;
			for( i = 0; i < count; i++ ){
				if( this._draw[i]._distance >= distance ){
					distance = this._draw[i]._distance;
					j = i;
				}
			}
			this._draw[j]._distance = -1.0;
			draw[k] = this._draw[j];
		}

		// まず、アルファ情報のない物体を描画する
		for( i = 0; i < count; i++ ){
			tmp = draw[i];
			glDrawUseProgram( _gl, tmp._p, tmp._index );
			glDrawSetProjectionMatrix( _gl, this._proj_mat, tmp._p, tmp._index );
			glDrawSetModelViewMatrix( _gl, tmp._mat, tmp._p, tmp._index );
			tmp.draw( glt, false );
		}

		// 次に、アルファ情報のある物体を描画する
		for( i = 0; i < count; i++ ){
			tmp = draw[i];
			glDrawUseProgram( _gl, tmp._p, tmp._index );
			glDrawSetProjectionMatrix( _gl, this._proj_mat, tmp._p, tmp._index );
			glDrawSetModelViewMatrix( _gl, tmp._mat, tmp._p, tmp._index );
			tmp.draw( glt, true );
		}
	}

};

//function glDrawUseProgram( gl, p, index ){}
//function glDrawSetProjectionMatrix( gl, mat, p, index ){}
//function glDrawSetModelViewMatrix( gl, mat, p, index ){}
