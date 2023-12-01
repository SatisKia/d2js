/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLTriangle( glu/*_GLUtility*/, model/*_GLModel*/, index ){
	var i, j;

	// 三角形の数を取得する
	this._num = 0;
	glu.beginGetTriangle();
	while( glu.getTriangle( model, index, false ) ){
		this._num++;
	}

	this._coord_x = null;
	this._coord_y = null;
	this._coord_z = null;
	this._normal_x = null;
	this._normal_y = null;
	this._normal_z = null;
	this._center_x = null;
	this._center_y = null;
	this._center_z = null;
	if( this._num > 0 ){
		this._coord_x = new Array( this._num );
		this._coord_y = new Array( this._num );
		this._coord_z = new Array( this._num );
		for( i = 0; i < this._num; i++ ){
			this._coord_x[i] = new Array( 3 );
			this._coord_y[i] = new Array( 3 );
			this._coord_z[i] = new Array( 3 );
		}
		this._normal_x = new Array( this._num );
		this._normal_y = new Array( this._num );
		this._normal_z = new Array( this._num );
		this._center_x = new Array( this._num );
		this._center_y = new Array( this._num );
		this._center_z = new Array( this._num );

		j = 0;
		glu.beginGetTriangle();
		while( glu.getTriangle( model, index, false ) ){
			for( i = 0; i < 3; i++ ){
				this._coord_x[j][i] = glu.coordX( i );
				this._coord_y[j][i] = glu.coordY( i );
				this._coord_z[j][i] = glu.coordZ( i );
			}

			glu.getTriangleNormal( model, index, false );
			this._normal_x[j] = glu.normalX();
			this._normal_y[j] = glu.normalY();
			this._normal_z[j] = glu.normalZ();

			this._center_x[j] = glu.centerX();
			this._center_y[j] = glu.centerY();
			this._center_z[j] = glu.centerZ();

			j++;
		}
	}
}

_GLTriangle.prototype = {

	num : function(){
		return this._num;
	},
	coord_x : function( i ){
		return this._coord_x[i];
	},
	coord_y : function( i ){
		return this._coord_y[i];
	},
	coord_z : function( i ){
		return this._coord_z[i];
	},
	normal_x : function( i ){
		return this._normal_x[i];
	},
	normal_y : function( i ){
		return this._normal_y[i];
	},
	normal_z : function( i ){
		return this._normal_z[i];
	},
	center_x : function( i ){
		return this._center_x[i];
	},
	center_y : function( i ){
		return this._center_y[i];
	},
	center_z : function( i ){
		return this._center_z[i];
	},

	check : function( i, x_min, x_max, y_min, y_max, z_min, z_max ){
		if(
			(this._center_x[i] >= x_min) && (this._center_x[i] <= x_max) &&
			(this._center_y[i] >= y_min) && (this._center_y[i] <= y_max) &&
			(this._center_z[i] >= z_min) && (this._center_z[i] <= z_max)
		){
			return true;
		}
		return false;
	},

	hitCheck : function( glu/*_GLUtility*/, px, py, pz, qx, qy, qz, r ){
		var i;
		for( i = 0; i < this._num; i++ ){
			if(
				(this._center_x[i] >= px - r) && (this._center_x[i] <= px + r) &&
				(this._center_y[i] >= py - r) && (this._center_y[i] <= py + r) &&
				(this._center_z[i] >= pz - r) && (this._center_z[i] <= pz + r)
			){
				if( glu.hitCheck( px, py, pz, qx, qy, qz, this._coord_x[i], this._coord_y[i], this._coord_z[i] ) ){
					return i;
				}
			}
		}
		return -1;
	}

};
