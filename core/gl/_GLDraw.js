/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLDrawPrimitive( p, index, tex_index, mat, trans ){
	this._p = p;
	this._index = index;
	this._tex_index = tex_index;
	this._mat = new Array( 16 );
	for( var i = 0; i < 16; i++ ){
		this._mat[i] = mat[i];
	}
	this._trans = (trans >= 0) ? trans : p._glp.transparency();
}
_GLDrawPrimitive.prototype = {
	draw : function( gl, glt/*_GLTexture*/, alpha ){
		switch( this._p._glp.type() ){
		case _GLPRIMITIVE_TYPE_MODEL:
			this._p._glp.setTransparency( this._trans );
			this._p.draw( gl, glt, this._index, this._tex_index, alpha );
			break;
		case _GLPRIMITIVE_TYPE_SPRITE:
			this._p._glp.setTransparency( this._trans );
			this._p.draw( gl, glt, this._tex_index, alpha );
			break;
		}
	}
};

function _GLDraw( proj_mat, look_mat ){
	var i;
	this._proj_mat = new Array( 16 );
	if( proj_mat != null ){
		for( i = 0; i < 16; i++ ){
			this._proj_mat[i] = proj_mat[i];
		}
	}
	this._look_mat = new Array( 16 );
	if( look_mat != null ){
		for( i = 0; i < 16; i++ ){
			this._look_mat[i] = look_mat[i];
		}
	}
	this._draw = new Array();
}

_GLDraw.prototype = {

	clear : function(){
		this._draw = new Array();
	},

	add : function( p, index, tex_index, mat, trans ){
		this._draw[this._draw.length] = new _GLDrawPrimitive( p, index, tex_index, mat, trans );
	},

	addSprite : function( glu/*_GLUtility*/, p, tex_index, x, y, z, trans ){
		this._draw[this._draw.length] = new _GLDrawPrimitive( p, -1, tex_index, glu.spriteMatrix( x, y, z ), trans );
	},

	draw : function( gl, glt/*_GLTexture*/ ){
		var i;
		var tmp;

		var count = this._draw.length;

		// まず、アルファ情報のない物体を描画する
		for( i = 0; i < count; i++ ){
			tmp = this._draw[i];
			glDrawUseProgram( gl, tmp._p, tmp._index );
			glDrawSetProjectionMatrix( gl, this._proj_mat, tmp._p, tmp._index );
			glDrawSetLookMatrix( gl, this._look_mat, tmp._p, tmp._index );
			glDrawSetModelViewMatrix( gl, tmp._mat, tmp._p, tmp._index );
			tmp.draw( gl, glt, false );
		}

		// 次に、アルファ情報のある物体を描画する
		for( i = 0; i < count; i++ ){
			tmp = this._draw[i];
			glDrawUseProgram( gl, tmp._p, tmp._index );
			glDrawSetProjectionMatrix( gl, this._proj_mat, tmp._p, tmp._index );
			glDrawSetLookMatrix( gl, this._look_mat, tmp._p, tmp._index );
			glDrawSetModelViewMatrix( gl, tmp._mat, tmp._p, tmp._index );
			tmp.draw( gl, glt, true );
		}
	}

};

//function glDrawUseProgram( gl, p, index ){}
//function glDrawSetProjectionMatrix( gl, mat, p, index ){}
//function glDrawSetLookMatrix( gl, mat, p, index ){}
//function glDrawSetModelViewMatrix( gl, mat, p, index ){}