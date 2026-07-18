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

	this._position_x = 0.0;
	this._position_y = 0.0;
	this._position_z = 0.0;
	this._look_x = 0.0;
	this._look_y = 0.0;
	this._look_z = 0.0;
	this._up_x = 0.0;
	this._up_y = 1.0;
	this._up_z = 0.0;
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

		this._position_x = _glu.positionX();
		this._position_y = _glu.positionY();
		this._position_z = _glu.positionZ();
		this._look_x = _glu.lookX();
		this._look_y = _glu.lookY();
		this._look_z = _glu.lookZ();
		this._up_x = _glu.upX();
		this._up_y = _glu.upY();
		this._up_z = _glu.upZ();
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

	_setMatrix : function( angle ){
		// 注視点を中心にY軸回転してカメラ位置を移動し、同じ注視点を見続ける
		var a = _glu.deg2rad( angle );
		var c = Math.cos( a );
		var s = Math.sin( a );
		var dx = this._position_x - this._look_x;
		var dz = this._position_z - this._look_z;
		var x = this._look_x + dx * c - dz * s;
		var y = this._position_y;
		var z = this._look_z + dx * s + dz * c;
		_glu.lookAt( x, y, z, this._look_x, this._look_y, this._look_z, this._up_x, this._up_y, this._up_z );
		glStereoSetViewMatrix( _gl, _glu.glMatrix() );
		_glu.setViewMatrix();
		_glu.setIdentity();
		_glu.multiply( _glu.viewMatrix() );
		_glu.translate( x, y, z );
		_glu.transpose();
		_glu.setLookMatrix();
	},
	draw : function(){
		// ビュー座標変換行列
		if( this._view_mat != null ){
			this._setMatrix( -this._angle );
		}

		this._left = true;
		glStereoDraw( _gl, _glu, this._left );

		// ビュー座標変換行列
		if( this._view_mat != null ){
			this._setMatrix( this._angle );
		}

		this._left = false;
		glStereoDraw( _gl, _glu, this._left );
	},

	getGraphics : function( originFlag ){
		var width = this._width / 2;
		var g = getGraphics();
		if( originFlag != undefined ){
			if( this._left ){
				g.setOrigin( 0, 0 );
				g.setClip( 0, 0, width, this._height );
			} else {
				if( originFlag ){
					g.setOrigin( width, 0 );
					g.setClip( 0, 0, width, this._height );
				} else {
					g.setOrigin( 0, 0 );
					g.setClip( width, 0, width, this._height );
				}
			}
		} else {
			g.setOrigin( 0, 0 );
			if( this._left ){
				g.setClip( 0, 0, width, this._height );
			} else {
				g.setClip( width, 0, width, this._height );
			}
		}
		return g;
	},

	draw2D : function( g ){
		var width = this._width / 2;
		g.setOrigin( 0, 0 );
		g.setClip( 0, 0, width, this._height );
		glStereoDraw2D( g, width );

		g.setOrigin( width, 0 );
		g.setClip( 0, 0, width, this._height );
		glStereoDraw2D( g, width );

		g.setOrigin( 0, 0 );
	}

};

//function glStereoSetProjectionMatrix( gl, mat ){}
//function glStereoSetViewMatrix( gl, mat ){}
//function glStereoDraw( gl, glu, leftFlag ){}
//function glStereoDraw2D( g, width ){}
