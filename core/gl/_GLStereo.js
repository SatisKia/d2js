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

	// スプライト用
	this._position_x = 0.0;
	this._position_y = 0.0;
	this._position_z = 0.0;
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

		// スプライト用
		this._position_x = _glu.positionX();
		this._position_y = _glu.positionY();
		this._position_z = _glu.positionZ();
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

	viewport : function( x, y, width, height ){
		if( x == undefined ){
			x = this._x;
		}
		if( y == undefined ){
			y = this._y;
		}
		if( width == undefined ){
			width = this._width;
		}
		if( height == undefined ){
			height = this._height;
		}
		if( this._left ){
			_glu.viewport( x, y, width / 2, height );
		} else {
			_glu.viewport( x + width / 2, y, width / 2, height );
		}
	},

	draw : function(){
		// ビュー座標変換行列
		if( this._view_mat != null ){
			_glu.set( _glu.utMatrix( this._view_mat ) );
			_glu.rotate( -this._angle, 0.0, 1.0, 0.0 );
			var mat = _glu.glMatrix();
			glStereoSetViewMatrix( _gl, mat );

			// スプライト用
			_glu.set( _glu.utMatrix( mat ) );
			_glu.translate( this._position_x, this._position_y, this._position_z );
			_glu.setLookMatrix( _glu.get() );
		}

		this._left = true;
		glStereoDraw( _gl, _glu, this._left );

		// ビュー座標変換行列
		if( this._view_mat != null ){
			_glu.set( _glu.utMatrix( this._view_mat ) );
			_glu.rotate( this._angle, 0.0, 1.0, 0.0 );
			var mat = _glu.glMatrix();
			glStereoSetViewMatrix( _gl, mat );

			// スプライト用
			_glu.set( _glu.utMatrix( mat ) );
			_glu.translate( this._position_x, this._position_y, this._position_z );
			_glu.setLookMatrix( _glu.get() );
		}

		this._left = false;
		glStereoDraw( _gl, _glu, this._left );
	},

	getGraphics : function( clip ){
		var g = getGraphics();
		if( clip ){
			if( this._left ){
				g.setClip( 0, 0, this._width / 2, this._height );
			} else {
				g.setClip( this._width / 2, 0, this._width / 2, this._height );
			}
		}
		return g;
	}

};

//function glStereoSetProjectionMatrix( gl, mat ){}
//function glStereoSetViewMatrix( gl, mat ){}
//function glStereoDraw( gl, glu, leftFlag ){}
