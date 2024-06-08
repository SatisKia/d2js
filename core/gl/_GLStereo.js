/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLStereo( x, y, width, height ){
	this._x = x;
	this._y = y;
	this._width = width;
	this._height = height;
	this._proj_mat = null;
	this._view_mat = null;
	this._angle = 0.0;
	this._left = true;
}

_GLStereo.prototype = {

	// プロジェクション座標変換行列
	setProjectionMatrix : function( mat ){
		_glu.set( _glu.utMatrix( mat ) );
		_glu.scale( 2.0, 1.0, 1.0 );
		this._proj_mat = _glu.glMatrix();
		glStereoSetProjectionMatrix( _gl, this._proj_mat );
	},
	projectionMatrix : function(){
		return this._proj_mat;
	},

	// ビュー座標変換行列
	setViewMatrix : function( mat, angle ){
		this._view_mat = mat;
		this._angle = angle;
	},

	clear : function( mask ){
		_gl.enable( _gl.SCISSOR_TEST );
		if( this._left ){
			_gl.scissor( this._x, this._y, this._width / 2, this._height );
		} else {
			_gl.scissor( this._x + this._width / 2, this._y, this._width / 2, this._height );
		}
		_gl.clear( mask );
		_gl.disable( _gl.SCISSOR_TEST );
	},

	viewport : function(){
		if( this._left ){
			_glu.viewport( this._x, this._y, this._width / 2, this._height );
		} else {
			_glu.viewport( this._x + this._width / 2, this._y, this._width / 2, this._height );
		}
	},

	draw : function(){
		// ビュー座標変換行列
		if( this._view_mat != null ){
			_glu.set( _glu.utMatrix( this._view_mat ) );
			_glu.rotate( -this._angle, 0.0, 1.0, 0.0 );
			glStereoSetViewMatrix( _gl, _glu.glMatrix() );
		}

		this._left = true;
		glStereoDraw( _gl, _glu, this._left );

		// ビュー座標変換行列
		if( this._view_mat != null ){
			_glu.set( _glu.utMatrix( this._view_mat ) );
			_glu.rotate( this._angle, 0.0, 1.0, 0.0 );
			glStereoSetViewMatrix( _gl, _glu.glMatrix() );
		}

		this._left = false;
		glStereoDraw( _gl, _glu, this._left );
	}

};

//function glStereoSetProjectionMatrix( gl, mat ){}
//function glStereoSetViewMatrix( gl, mat ){}
//function glStereoDraw( gl, glu, leftFlag ){}
