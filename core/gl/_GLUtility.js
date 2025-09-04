/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#define _GLUTILITY_TOLERANCE_M	-1.0
#define _GLUTILITY_TOLERANCE	1.0

function _GLUtilitySave(){
	this.util_mat = new Array( 16 );
	this.look_mat = new Array( 16 );
	this.view_mat = new Array( 16 );
}
_GLUtilitySave.prototype = {
	push : function( glu ){
		for( var i = 0; i < 16; i++ ){
			this.util_mat[i] = glu.util_mat[i];
			this.look_mat[i] = glu.look_mat[i];
			this.view_mat[i] = glu.view_mat[i];
		}
	},
	pop : function( glu ){
		for( var i = 0; i < 16; i++ ){
			glu.util_mat[i] = this.util_mat[i];
			glu.look_mat[i] = this.look_mat[i];
			glu.view_mat[i] = this.view_mat[i];
		}
	},
};

function _GLUtility(){
	this.save = new Array();
	this.save_num = 0;

	// 各種行列演算用
	this.util_mat = new Array( 16 );
	this.tmp_mat = new Array( 16 );

	// 回転
	this._rotate = new Array( 16 );
	this._rotate[ 3] = 0.0;
	this._rotate[ 7] = 0.0;
	this._rotate[11] = 0.0;
	this._rotate[12] = 0.0;
	this._rotate[13] = 0.0;
	this._rotate[14] = 0.0;
	this._rotate[15] = 1.0;

	// 拡大・縮小
	this._scale = new Array( 16 );
	this._scale[ 0] = 1.0; this._scale[ 1] = 0.0; this._scale[ 2] = 0.0; this._scale[ 3] = 0.0;
	this._scale[ 4] = 0.0; this._scale[ 5] = 1.0; this._scale[ 6] = 0.0; this._scale[ 7] = 0.0;
	this._scale[ 8] = 0.0; this._scale[ 9] = 0.0; this._scale[10] = 1.0; this._scale[11] = 0.0;
	this._scale[12] = 0.0; this._scale[13] = 0.0; this._scale[14] = 0.0; this._scale[15] = 1.0;

	// 平行移動
	this._translate = new Array( 16 );
	this._translate[ 0] = 1.0; this._translate[ 1] = 0.0; this._translate[ 2] = 0.0; this._translate[ 3] = 0.0;
	this._translate[ 4] = 0.0; this._translate[ 5] = 1.0; this._translate[ 6] = 0.0; this._translate[ 7] = 0.0;
	this._translate[ 8] = 0.0; this._translate[ 9] = 0.0; this._translate[10] = 1.0; this._translate[11] = 0.0;
	this._translate[12] = 0.0; this._translate[13] = 0.0; this._translate[14] = 0.0; this._translate[15] = 1.0;

	// 点の座標を表すベクトルを変換行列で変換
	this.trans_x = 0.0;
	this.trans_y = 0.0;
	this.trans_z = 0.0;

	// 外積
	this.cross_x = 0.0;
	this.cross_y = 0.0;
	this.cross_z = 0.0;

	// 正規化
	this.normalize_x = 0.0;
	this.normalize_y = 0.0;
	this.normalize_z = 0.0;

	// 反射
	this.reflect_x = 0.0;
	this.reflect_y = 0.0;
	this.reflect_z = 0.0;

	// 三角形を検索
	this.seek_len = 0;
	this.seek_vertex = new Array( 3 );
	this.coord_x = new Array( 3 );
	this.coord_y = new Array( 3 );
	this.coord_z = new Array( 3 );
	this.normal_x = 0.0;
	this.normal_y = 0.0;
	this.normal_z = 0.0;
	this.center_x = 0.0;
	this.center_y = 0.0;
	this.center_z = 0.0;

	// 辺と三角形ポリゴンとの当たり判定
	this.hit_x = 0.0;
	this.hit_y = 0.0;
	this.hit_z = 0.0;

	// lookAt用
	this.position_x = 0.0;
	this.position_y = 0.0;
	this.position_z = 0.0;
	this.look_side = new Array( 3 );
	this.look_mat = new Array( 16 );
	this.view_mat = new Array( 16 );

	// frustum用
	this.proj_mat = new Array( 16 );

	// viewport用
	this.viewport_mat = new Array( 4 );

	// project用
	this.project_in = new Array( 4 );
	this.project_out = new Array( 4 );
	this.project_x = 0.0;
	this.project_y = 0.0;
	this.project_z = 0.0;
}

_GLUtility.prototype = {

	/*
	 * glGenTextures
	 */
	genTextures : function( n, textures ){
		for( var i = 0; i < n; i++ ){
			textures[i] = _gl.createTexture();
		}
	},

	/*
	 * glDeleteTextures
	 */
	deleteTextures : function( n, textures ){
		for( var i = 0; i < n; i++ ){
			_gl.deleteTexture( textures[i] );
		}
	},

	/*
	 * glBindTexture
	 */
	bindTexture : function( target, texture ){
		if( texture == undefined ){	// パラメータが1つの場合
			texture = target;
			target = _gl.TEXTURE_2D;
		}
		_gl.bindTexture( target, texture );
	},

	/*
	 * glTexImage2D
	 */
	texImage2D : function( target, image/*ImageData*/ ){
		if( image == undefined ){	// パラメータが1つの場合
			image = target;
			target = _gl.TEXTURE_2D;
		}
		var level = 0;
		var internalformat = _gl.RGBA;
		var format = _gl.RGBA;
		var type = _gl.UNSIGNED_BYTE;
		_gl.texImage2D( target, level, internalformat, format, type, image );
	},

	deg2rad : function( angle ){
		return (angle * 3.14159265358979323846264) / 180.0;
	},
	rad2deg : function( angle ){
		return (angle * 180.0) / 3.14159265358979323846264;
	},

	/*
	 * 各種行列演算後の、OpenGL用行列の取得
	 */
	glMatrix : function(){
		var _matrix = new Float32Array( 16 );
		var i, j, k;
		for( j = 0; j < 4; j++ ){
			k = j * 4;
			for( i = 0; i < 4; i++ ){
				_matrix[k + i] = this.util_mat[i * 4 + j];
			}
		}
		return _matrix;
	},

	/*
	 * OpenGL用行列を_GLUtility用行列に変換
	 */
	utMatrix : function( matrix/*Float32Array*/ ){
		var _matrix = new Array( 16 );
		var i, j, k;
		for( j = 0; j < 4; j++ ){
			k = j * 4;
			for( i = 0; i < 4; i++ ){
				_matrix[k + i] = matrix[i * 4 + j];
			}
		}
		return _matrix;
	},

	push : function(){
		if( this.save[this.save_num] == undefined ){
			this.save[this.save_num] = new _GLUtilitySave();
		}
		this.save[this.save_num].push( this );
		this.save_num++;
	},
	pop : function(){
		if( this.save_num > 0 ){
			this.save_num--;
			this.save[this.save_num].pop( this );
		}
	},

	/*
	 * 逆行列
	 */
	invert : function(){
		var det;

		this.tmp_mat[ 0] =  this.util_mat[5] * this.util_mat[10] * this.util_mat[15] - this.util_mat[5] * this.util_mat[11] * this.util_mat[14] - this.util_mat[9] * this.util_mat[6] * this.util_mat[15] + this.util_mat[9] * this.util_mat[7] * this.util_mat[14] + this.util_mat[13] * this.util_mat[6] * this.util_mat[11] - this.util_mat[13] * this.util_mat[7] * this.util_mat[10];
		this.tmp_mat[ 4] = -this.util_mat[4] * this.util_mat[10] * this.util_mat[15] + this.util_mat[4] * this.util_mat[11] * this.util_mat[14] + this.util_mat[8] * this.util_mat[6] * this.util_mat[15] - this.util_mat[8] * this.util_mat[7] * this.util_mat[14] - this.util_mat[12] * this.util_mat[6] * this.util_mat[11] + this.util_mat[12] * this.util_mat[7] * this.util_mat[10];
		this.tmp_mat[ 8] =  this.util_mat[4] * this.util_mat[ 9] * this.util_mat[15] - this.util_mat[4] * this.util_mat[11] * this.util_mat[13] - this.util_mat[8] * this.util_mat[5] * this.util_mat[15] + this.util_mat[8] * this.util_mat[7] * this.util_mat[13] + this.util_mat[12] * this.util_mat[5] * this.util_mat[11] - this.util_mat[12] * this.util_mat[7] * this.util_mat[ 9];
		this.tmp_mat[12] = -this.util_mat[4] * this.util_mat[ 9] * this.util_mat[14] + this.util_mat[4] * this.util_mat[10] * this.util_mat[13] + this.util_mat[8] * this.util_mat[5] * this.util_mat[14] - this.util_mat[8] * this.util_mat[6] * this.util_mat[13] - this.util_mat[12] * this.util_mat[5] * this.util_mat[10] + this.util_mat[12] * this.util_mat[6] * this.util_mat[ 9];
		this.tmp_mat[ 1] = -this.util_mat[1] * this.util_mat[10] * this.util_mat[15] + this.util_mat[1] * this.util_mat[11] * this.util_mat[14] + this.util_mat[9] * this.util_mat[2] * this.util_mat[15] - this.util_mat[9] * this.util_mat[3] * this.util_mat[14] - this.util_mat[13] * this.util_mat[2] * this.util_mat[11] + this.util_mat[13] * this.util_mat[3] * this.util_mat[10];
		this.tmp_mat[ 5] =  this.util_mat[0] * this.util_mat[10] * this.util_mat[15] - this.util_mat[0] * this.util_mat[11] * this.util_mat[14] - this.util_mat[8] * this.util_mat[2] * this.util_mat[15] + this.util_mat[8] * this.util_mat[3] * this.util_mat[14] + this.util_mat[12] * this.util_mat[2] * this.util_mat[11] - this.util_mat[12] * this.util_mat[3] * this.util_mat[10];
		this.tmp_mat[ 9] = -this.util_mat[0] * this.util_mat[ 9] * this.util_mat[15] + this.util_mat[0] * this.util_mat[11] * this.util_mat[13] + this.util_mat[8] * this.util_mat[1] * this.util_mat[15] - this.util_mat[8] * this.util_mat[3] * this.util_mat[13] - this.util_mat[12] * this.util_mat[1] * this.util_mat[11] + this.util_mat[12] * this.util_mat[3] * this.util_mat[ 9];
		this.tmp_mat[13] =  this.util_mat[0] * this.util_mat[ 9] * this.util_mat[14] - this.util_mat[0] * this.util_mat[10] * this.util_mat[13] - this.util_mat[8] * this.util_mat[1] * this.util_mat[14] + this.util_mat[8] * this.util_mat[2] * this.util_mat[13] + this.util_mat[12] * this.util_mat[1] * this.util_mat[10] - this.util_mat[12] * this.util_mat[2] * this.util_mat[ 9];
		this.tmp_mat[ 2] =  this.util_mat[1] * this.util_mat[ 6] * this.util_mat[15] - this.util_mat[1] * this.util_mat[ 7] * this.util_mat[14] - this.util_mat[5] * this.util_mat[2] * this.util_mat[15] + this.util_mat[5] * this.util_mat[3] * this.util_mat[14] + this.util_mat[13] * this.util_mat[2] * this.util_mat[ 7] - this.util_mat[13] * this.util_mat[3] * this.util_mat[ 6];
		this.tmp_mat[ 6] = -this.util_mat[0] * this.util_mat[ 6] * this.util_mat[15] + this.util_mat[0] * this.util_mat[ 7] * this.util_mat[14] + this.util_mat[4] * this.util_mat[2] * this.util_mat[15] - this.util_mat[4] * this.util_mat[3] * this.util_mat[14] - this.util_mat[12] * this.util_mat[2] * this.util_mat[ 7] + this.util_mat[12] * this.util_mat[3] * this.util_mat[ 6];
		this.tmp_mat[10] =  this.util_mat[0] * this.util_mat[ 5] * this.util_mat[15] - this.util_mat[0] * this.util_mat[ 7] * this.util_mat[13] - this.util_mat[4] * this.util_mat[1] * this.util_mat[15] + this.util_mat[4] * this.util_mat[3] * this.util_mat[13] + this.util_mat[12] * this.util_mat[1] * this.util_mat[ 7] - this.util_mat[12] * this.util_mat[3] * this.util_mat[ 5];
		this.tmp_mat[14] = -this.util_mat[0] * this.util_mat[ 5] * this.util_mat[14] + this.util_mat[0] * this.util_mat[ 6] * this.util_mat[13] + this.util_mat[4] * this.util_mat[1] * this.util_mat[14] - this.util_mat[4] * this.util_mat[2] * this.util_mat[13] - this.util_mat[12] * this.util_mat[1] * this.util_mat[ 6] + this.util_mat[12] * this.util_mat[2] * this.util_mat[ 5];
		this.tmp_mat[ 3] = -this.util_mat[1] * this.util_mat[ 6] * this.util_mat[11] + this.util_mat[1] * this.util_mat[ 7] * this.util_mat[10] + this.util_mat[5] * this.util_mat[2] * this.util_mat[11] - this.util_mat[5] * this.util_mat[3] * this.util_mat[10] - this.util_mat[ 9] * this.util_mat[2] * this.util_mat[ 7] + this.util_mat[ 9] * this.util_mat[3] * this.util_mat[ 6];
		this.tmp_mat[ 7] =  this.util_mat[0] * this.util_mat[ 6] * this.util_mat[11] - this.util_mat[0] * this.util_mat[ 7] * this.util_mat[10] - this.util_mat[4] * this.util_mat[2] * this.util_mat[11] + this.util_mat[4] * this.util_mat[3] * this.util_mat[10] + this.util_mat[ 8] * this.util_mat[2] * this.util_mat[ 7] - this.util_mat[ 8] * this.util_mat[3] * this.util_mat[ 6];
		this.tmp_mat[11] = -this.util_mat[0] * this.util_mat[ 5] * this.util_mat[11] + this.util_mat[0] * this.util_mat[ 7] * this.util_mat[ 9] + this.util_mat[4] * this.util_mat[1] * this.util_mat[11] - this.util_mat[4] * this.util_mat[3] * this.util_mat[ 9] - this.util_mat[ 8] * this.util_mat[1] * this.util_mat[ 7] + this.util_mat[ 8] * this.util_mat[3] * this.util_mat[ 5];
		this.tmp_mat[15] =  this.util_mat[0] * this.util_mat[ 5] * this.util_mat[10] - this.util_mat[0] * this.util_mat[ 6] * this.util_mat[ 9] - this.util_mat[4] * this.util_mat[1] * this.util_mat[10] + this.util_mat[4] * this.util_mat[2] * this.util_mat[ 9] + this.util_mat[ 8] * this.util_mat[1] * this.util_mat[ 6] - this.util_mat[ 8] * this.util_mat[2] * this.util_mat[ 5];

		det = this.util_mat[0] * this.tmp_mat[0] + this.util_mat[1] * this.tmp_mat[4] + this.util_mat[2] * this.tmp_mat[8] + this.util_mat[3] * this.tmp_mat[12];
		if( det == 0.0 ){
			return false;
		}
		det = 1.0 / det;

		for( var i = 0; i < 16; i++ ){
			this.util_mat[i] = this.tmp_mat[i] * det;
		}

		return true;
	},

	/*
	 * 積
	 */
	multiply : function( matrix ){
		var i, j, k;
		for( j = 0; j < 4; j++ ){
			k = j * 4;
			for( i = 0; i < 4; i++ ){
				this.tmp_mat[k + i] =
					this.util_mat[k    ] * matrix[     i] +
					this.util_mat[k + 1] * matrix[ 4 + i] +
					this.util_mat[k + 2] * matrix[ 8 + i] +
					this.util_mat[k + 3] * matrix[12 + i];
			}
		}
		this.set( this.tmp_mat );
	},

	/*
	 * 回転
	 */
	rotate : function( angle, x, y, z ){
		// 正規化
		var d = Math.sqrt( x * x + y * y + z * z );
		if( d != 0.0 ){
			x /= d;
			y /= d;
			z /= d;
		}

		var a = this.deg2rad( angle );
		var c = Math.cos( a );
		var s = Math.sin( a );
		var c2 = 1.0 - c;
		this._rotate[ 0] = x * x * c2 + c;
		this._rotate[ 1] = x * y * c2 - z * s;
		this._rotate[ 2] = x * z * c2 + y * s;
		this._rotate[ 4] = y * x * c2 + z * s;
		this._rotate[ 5] = y * y * c2 + c;
		this._rotate[ 6] = y * z * c2 - x * s;
		this._rotate[ 8] = x * z * c2 - y * s;
		this._rotate[ 9] = y * z * c2 + x * s;
		this._rotate[10] = z * z * c2 + c;
		this.multiply( this._rotate );
	},

	/*
	 * 拡大・縮小
	 */
	scale : function( x, y, z ){
		this._scale[ 0] = x;
		this._scale[ 5] = y;
		this._scale[10] = z;
		this.multiply( this._scale );
	},

	/*
	 * 値の取得
	 */
	get : function(){
		var _matrix = new Array( 16 );
		for( var i = 0; i < 16; i++ ){
			_matrix[i] = this.util_mat[i];
		}
		return _matrix;
	},

	/*
	 * 値の設定
	 */
	set : function( matrix ){
		for( var i = 0; i < 16; i++ ){
			this.util_mat[i] = matrix[i];
		}
	},
	setVal : function( index, value ){
		this.util_mat[index] = value;
	},

	/*
	 * 単位行列
	 */
	setIdentity : function(){
		this.util_mat[ 0] = 1.0; this.util_mat[ 1] = 0.0; this.util_mat[ 2] = 0.0; this.util_mat[ 3] = 0.0;
		this.util_mat[ 4] = 0.0; this.util_mat[ 5] = 1.0; this.util_mat[ 6] = 0.0; this.util_mat[ 7] = 0.0;
		this.util_mat[ 8] = 0.0; this.util_mat[ 9] = 0.0; this.util_mat[10] = 1.0; this.util_mat[11] = 0.0;
		this.util_mat[12] = 0.0; this.util_mat[13] = 0.0; this.util_mat[14] = 0.0; this.util_mat[15] = 1.0;
	},

	/*
	 * 平行移動
	 */
	translate : function( x, y, z ){
		this._translate[ 3] = x;
		this._translate[ 7] = y;
		this._translate[11] = z;
		this.multiply( this._translate );
	},

	/*
	 * 転置行列
	 */
	transpose : function(){
		var i, j, k;
		for( j = 0; j < 4; j++ ){
			k = j * 4;
			for( i = 0; i < 4; i++ ){
				this.tmp_mat[k + i] = this.util_mat[i * 4 + j];
			}
		}
		this.set( this.tmp_mat );
	},

	/*
	 * 点の座標を表すベクトルを変換行列で変換
	 */
	transVector : function( x, y, z ){
		this.trans_x = this.util_mat[0] * x + this.util_mat[1] * y + this.util_mat[ 2] * z + this.util_mat[ 3] * 1.0;
		this.trans_y = this.util_mat[4] * x + this.util_mat[5] * y + this.util_mat[ 6] * z + this.util_mat[ 7] * 1.0;
		this.trans_z = this.util_mat[8] * x + this.util_mat[9] * y + this.util_mat[10] * z + this.util_mat[11] * 1.0;
	},

	/*
	 * 外積
	 */
	cross : function( x1, y1, z1, x2, y2, z2 ){
		this.cross_x = y1 * z2 - z1 * y2;
		this.cross_y = z1 * x2 - x1 * z2;
		this.cross_z = x1 * y2 - y1 * x2;
	},

	/*
	 * 内積
	 */
	dot : function( x1, y1, z1, x2, y2, z2 ){
		return x1 * x2 + y1 * y2 + z1 * z2;
	},

	/*
	 * 距離
	 */
	distance : function( x, y, z ){
		return Math.sqrt( x * x + y * y + z * z );
	},

	/*
	 * 正規化
	 */
	normalize : function( x, y, z ){
		var d = Math.sqrt( x * x + y * y + z * z );
		if( d != 0.0 ){
			this.normalize_x = x / d;
			this.normalize_y = y / d;
			this.normalize_z = z / d;
		} else {
			this.normalize_x = 0.0;
			this.normalize_y = 0.0;
			this.normalize_z = 0.0;
		}
	},

	/*
	 * 反射
	 */
	reflect : function( vx, vy, vz, nx, ny, nz ){
		var s = this.dot( -vx, -vy, -vz, nx, ny, nz );
		var px = nx * s;
		var py = ny * s;
		var pz = nz * s;
		this.reflect_x = vx + px + px;
		this.reflect_y = vy + py + py;
		this.reflect_z = vz + pz + pz;
	},

	/*
	 * 三角形を検索（_GLModelオブジェクトの_stripが三角形ストリップの場合）
	 */
	beginGetTriangle : function(){
		this.seek_len = 2;
	},
	getTriangle : function( model/*_GLModel*/, index, trans ){
		var ret = false;
		while( this.seek_len < model._strip_len[index] ){
			for( var i = 0; i < 3; i++ ){
				this.seek_vertex[i] = model._strip[index][this.seek_len - i];
			}
			this.seek_len++;
			if( (this.seek_vertex[0] != this.seek_vertex[1]) && (this.seek_vertex[0] != this.seek_vertex[2]) && (this.seek_vertex[1] != this.seek_vertex[2]) ){
				ret = true;
				break;
			}
		}
		if( ret ){
			this.getTriangleCoord( model, index, trans );

			// 三角形の中心を求めておく
			this.center_x = (this.coord_x[0] + this.coord_x[1] + this.coord_x[2]) / 3.0;
			this.center_y = (this.coord_y[0] + this.coord_y[1] + this.coord_y[2]) / 3.0;
			this.center_z = (this.coord_z[0] + this.coord_z[1] + this.coord_z[2]) / 3.0;
		}
		return ret;
	},
	getTriangleCoord : function( model/*_GLModel*/, index, trans ){
		var i;
		for( i = 0; i < 3; i++ ){
			this.coord_x[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3    ];
			this.coord_y[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3 + 1];
			this.coord_z[i] = model._coord[model._strip_coord[index]][this.seek_vertex[i] * 3 + 2];
		}
		if( trans ){
			for( i = 0; i < 3; i++ ){
				this.transVector( this.coord_x[i], this.coord_y[i], this.coord_z[i] );
				this.coord_x[i] = this.trans_x;
				this.coord_y[i] = this.trans_y;
				this.coord_z[i] = this.trans_z;
			}
		}
	},
	getTriangleNormal : function( model/*_GLModel*/, index, trans ){
		if( model._strip_normal[index] >= 0 ){
			var x = 0.0;
			var y = 0.0;
			var z = 0.0;
			for( var i = 0; i < 3; i++ ){
				x += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3    ];
				y += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3 + 1];
				z += model._normal[model._strip_normal[index]][this.seek_vertex[i] * 3 + 2];
			}
			if( trans ){
				this.transVector( x, y, z );
				x = this.trans_x;
				y = this.trans_y;
				z = this.trans_z;
			}

			// 水平または垂直な面は、三角形の座標から法線を求める
			this.cross(
				this.coord_x[1] - this.coord_x[0],
				this.coord_y[1] - this.coord_y[0],
				this.coord_z[1] - this.coord_z[0],
				this.coord_x[2] - this.coord_x[0],
				this.coord_y[2] - this.coord_y[0],
				this.coord_z[2] - this.coord_z[0]
				);
			this.cross_x = Math.abs( this.cross_x );
			this.cross_y = Math.abs( this.cross_y );
			this.cross_z = Math.abs( this.cross_z );

			// 誤差を考慮
			if( (this.cross_x < _GLUTILITY_TOLERANCE) || (this.cross_y < _GLUTILITY_TOLERANCE) || (this.cross_z < _GLUTILITY_TOLERANCE) ){
				x = (x < 0.0) ? -this.cross_x : this.cross_x;
				y = (y < 0.0) ? -this.cross_y : this.cross_y;
				z = (z < 0.0) ? -this.cross_z : this.cross_z;
			}

			// 正規化
			this.normalize( x, y, z );
			this.normal_x = this.normalize_x;
			this.normal_y = this.normalize_y;
			this.normal_z = this.normalize_z;
		}
	},
	checkTriangle : function( x_min, x_max, y_min, y_max, z_min, z_max ){
		if(
			(this.center_x >= x_min) && (this.center_x <= x_max) &&
			(this.center_y >= y_min) && (this.center_y <= y_max) &&
			(this.center_z >= z_min) && (this.center_z <= z_max)
		){
			return true;
		}
		return false;
	},

	/*
	 * 辺と三角形ポリゴンとの当たり判定
	 */
	hitCheck : function( px, py, pz, qx, qy, qz, cx, cy, cz ){
		// 平面の方程式より法線ベクトルを求める
		this.cross(
			cx[1] - cx[0],
			cy[1] - cy[0],
			cz[1] - cz[0],
			cx[2] - cx[0],
			cy[2] - cy[0],
			cz[2] - cz[0]
			);
		var nx = this.cross_x;
		var ny = this.cross_y;
		var nz = this.cross_z;

		// 直線の方程式よりuを求める
		var ux = qx - px;
		var uy = qy - py;
		var uz = qz - pz;

		// 交点を求める
		var top = nx * (cx[0] - px) + ny * (cy[0] - py) + nz * (cz[0] - pz);
		var bottom = this.dot( nx, ny, nz, ux, uy, uz );

		// 平行である場合、抜ける
		if( bottom == 0.0 ){
			return false;
		}

		// tを求める
		var t = top / bottom;

		// 0<=t<=1以外の場合、交差していないので抜ける
		if( (t < 0.0) || (t > 1.0) ){
			return false;
		}

		// 面と線の交点を求める
		this.hit_x = px + t * ux;
		this.hit_y = py + t * uy;
		this.hit_z = pz + t * uz;

		// 三角形内外判定
		for( var i = 0; i < 3; i++ ){
			// 外積を利用して内外判定
			this.cross(
				cx[(i == 2) ? 0 : i + 1] - cx[i],
				cy[(i == 2) ? 0 : i + 1] - cy[i],
				cz[(i == 2) ? 0 : i + 1] - cz[i],
				this.hit_x - cx[i],
				this.hit_y - cy[i],
				this.hit_z - cz[i]
				);

			// すべての場合の法線が同一方向ならば、三角ポリゴン内に存在する（誤差を考慮）
			if( ((this.cross_x * nx) < _GLUTILITY_TOLERANCE_M) || ((this.cross_y * ny) < _GLUTILITY_TOLERANCE_M) || ((this.cross_z * nz) < _GLUTILITY_TOLERANCE_M) ){
				return false;
			}
		}

		return true;	// 交点有り
	},

	/*
	 * gluLookAt
	 */
	lookAt : function( position_x, position_y, position_z, look_x, look_y, look_z, up_x, up_y, up_z ){
		var d;

		this.position_x = position_x;
		this.position_y = position_y;
		this.position_z = position_z;
		look_x -= this.position_x;
		look_y -= this.position_y;
		look_z -= this.position_z;
		d = Math.sqrt( look_x * look_x + look_y * look_y + look_z * look_z );
		if( d != 0.0 ){
			look_x /= d;
			look_y /= d;
			look_z /= d;
		}

		this.look_side[0] = look_y * up_z - look_z * up_y;
		this.look_side[1] = look_z * up_x - look_x * up_z;
		this.look_side[2] = look_x * up_y - look_y * up_x;
		d = Math.sqrt( this.look_side[0] * this.look_side[0] + this.look_side[1] * this.look_side[1] + this.look_side[2] * this.look_side[2] );
		if( d != 0.0 ){
			this.look_side[0] /= d;
			this.look_side[1] /= d;
			this.look_side[2] /= d;
		}

		up_x = this.look_side[1] * look_z - this.look_side[2] * look_y;
		up_y = this.look_side[2] * look_x - this.look_side[0] * look_z;
		up_z = this.look_side[0] * look_y - this.look_side[1] * look_x;

		this.look_mat[ 0] = this.look_side[0]; this.look_mat[ 1] = up_x; this.look_mat[ 2] = -look_x; this.look_mat[ 3] = 0.0;
		this.look_mat[ 4] = this.look_side[1]; this.look_mat[ 5] = up_y; this.look_mat[ 6] = -look_y; this.look_mat[ 7] = 0.0;
		this.look_mat[ 8] = this.look_side[2]; this.look_mat[ 9] = up_z; this.look_mat[10] = -look_z; this.look_mat[11] = 0.0;
		this.look_mat[12] = 0.0              ; this.look_mat[13] = 0.0 ; this.look_mat[14] = 0.0    ; this.look_mat[15] = 1.0;

		// ビュー行列を取得
		// （OpenGL形式の行列を_GLUtility形式の行列に変換）
		var i, j, k;
		for( j = 0; j < 4; j++ ){
			k = j * 4;
			for( i = 0; i < 4; i++ ){
				this.view_mat[k + i] = this.look_mat[i * 4 + j];
			}
		}
		this.set( this.view_mat );
		this.translate( -this.position_x, -this.position_y, -this.position_z );
		for( i = 0; i < 16; i++ ){
			this.view_mat[i] = this.util_mat[i];
		}
	},
	viewMatrix : function(){
		var _matrix = new Array( 16 );
		for( var i = 0; i < 16; i++ ){
			_matrix[i] = this.view_mat[i];
		}
		return _matrix;
	},
	lookMatrix : function(){
		var _matrix = new Array( 16 );
		for( var i = 0; i < 16; i++ ){
			_matrix[i] = this.look_mat[i];
		}
		return _matrix;
	},
	setViewMatrix : function( matrix ){
		if( (matrix == null) || (matrix == undefined) ){
			matrix = this.util_mat;
		}
		for( var i = 0; i < 16; i++ ){
			this.view_mat[i] = matrix[i];
		}
	},
	setLookMatrix : function( matrix ){
		if( (matrix == null) || (matrix == undefined) ){
			matrix = this.util_mat;
		}
		for( var i = 0; i < 16; i++ ){
			this.look_mat[i] = matrix[i];
		}
	},
	spriteMatrix : function( x, y, z, view_flag ){
		if( view_flag == undefined ){
			view_flag = true;
		}
		if( view_flag ){
			this.set( this.view_mat );
		} else {
			this.setIdentity();
		}
		this.translate( x, y, z );
		this.multiply( this.look_mat );
		return this.glMatrix();
	},

	/*
	 * glFrustum
	 */
	frustum : function( l, r, b, t, n, f ){
		// 現在の行列に射影行列を乗算
		/******************************************
		 *   2 n                r + l             *
		 * -------     0       -------       0    *
		 *  r - l               r - l             *
		 *                                        *
		 *            2 n       t + b             *
		 *    0     -------    -------       0    *
		 *           t - b      t - b             *
		 *                                        *
		 *                      f + n      2 f n  *
		 *    0        0     - -------  - ------- *
		 *                      f - n      f - n  *
		 *                                        *
		 *    0        0         -1          0    *
		 ******************************************/
		this.proj_mat[ 0] = (2.0 * n) / (r - l);
		this.proj_mat[ 1] = 0.0;
		this.proj_mat[ 2] = (r + l) / (r - l);
		this.proj_mat[ 3] = 0.0;
		this.proj_mat[ 4] = 0.0;
		this.proj_mat[ 5] = (2.0 * n) / (t - b);
		this.proj_mat[ 6] = (t + b) / (t - b);
		this.proj_mat[ 7] = 0.0;
		this.proj_mat[ 8] = 0.0;
		this.proj_mat[ 9] = 0.0;
		this.proj_mat[10] = -(f + n) / (f - n);
		this.proj_mat[11] = -(2.0 * f * n) / (f - n);
		this.proj_mat[12] = 0.0;
		this.proj_mat[13] = 0.0;
		this.proj_mat[14] = -1.0;
		this.proj_mat[15] = 0.0;
		this.multiply( this.proj_mat );
		for( var i = 0; i < 16; i++ ){
			this.proj_mat[i] = this.util_mat[i];
		}
	},

	/*
	 * glOrtho
	 */
	ortho : function( l, r, b, t, n, f ){
		// 現在の行列に正投影行列を乗算
		/******************************************
		 *    2                            r + l  *
		 * -------     0          0     - ------- *
		 *  r - l                          r - l  *
		 *                                        *
		 *             2                   t + b  *
		 *    0     -------       0     - ------- *
		 *           t - b                 t - b  *
		 *                                        *
		 *                        2        f + n  *
		 *    0        0     - -------  - ------- *
		 *                      f - n      f - n  *
		 *                                        *
		 *    0        0          0          1    *
		 ******************************************/
		this.proj_mat[ 0] = 2.0 / (r - l);
		this.proj_mat[ 1] = 0.0;
		this.proj_mat[ 2] = 0.0;
		this.proj_mat[ 3] = -(r + l) / (r - l);
		this.proj_mat[ 4] = 0.0;
		this.proj_mat[ 5] = 2.0 / (t - b);
		this.proj_mat[ 6] = 0.0;
		this.proj_mat[ 7] = -(t + b) / (t - b);
		this.proj_mat[ 8] = 0.0;
		this.proj_mat[ 9] = 0.0;
		this.proj_mat[10] = -2.0 / (f - n);
		this.proj_mat[11] = -(f + n) / (f - n);
		this.proj_mat[12] = 0.0;
		this.proj_mat[13] = 0.0;
		this.proj_mat[14] = 0.0;
		this.proj_mat[15] = 1.0;
		this.multiply( this.proj_mat );
		for( var i = 0; i < 16; i++ ){
			this.proj_mat[i] = this.util_mat[i];
		}
	},

	/*
	 * gluPerspective
	 */
	perspective : function( fovy, a, n, f ){
		// 現在の行列に射影行列を乗算
		// F = cotangent(fovy / 2)
		// cotangent(t) = 1 / tan(t)
		/****************************
		 *  F                       *
		 * ---  0     0        0    *
		 *  a                       *
		 *                          *
		 *  0   F     0        0    *
		 *                          *
		 *          f + n    2 f n  *
		 *  0   0  -------  ------- *
		 *          n - f    n - f  *
		 *                          *
		 *  0   0    -1        0    *
		 ****************************/
		var F = 1.0 / Math.tan(((fovy * Math.PI) / 180.0) / 2.0);
		this.proj_mat[ 0] = F / a;
		this.proj_mat[ 1] = 0.0;
		this.proj_mat[ 2] = 0.0;
		this.proj_mat[ 3] = 0.0;
		this.proj_mat[ 4] = 0.0;
		this.proj_mat[ 5] = F;
		this.proj_mat[ 6] = 0.0;
		this.proj_mat[ 7] = 0.0;
		this.proj_mat[ 8] = 0.0;
		this.proj_mat[ 9] = 0.0;
		this.proj_mat[10] = (f + n) / (n - f);
		this.proj_mat[11] = (2.0 * f * n) / (n - f);
		this.proj_mat[12] = 0.0;
		this.proj_mat[13] = 0.0;
		this.proj_mat[14] = -1.0;
		this.proj_mat[15] = 0.0;
		this.multiply( this.proj_mat );
		for( var i = 0; i < 16; i++ ){
			this.proj_mat[i] = this.util_mat[i];
		}
	},

	setProjMatrix : function( matrix ){
		for( var i = 0; i < 16; i++ ){
			this.proj_mat[i] = matrix[i];
		}
	},

	/*
	 * glViewport
	 */
	viewport : function( x, y, width, height ){
		_gl.viewport( x, y, width, height );

		// ビューポート行列を取得
		this.viewport_mat[0] = x;
		this.viewport_mat[1] = y;
		this.viewport_mat[2] = width;
		this.viewport_mat[3] = height;
	},

	/*
	 * gluProject
	 */
	project : function( obj_x, obj_y, obj_z, mv_mat, p_mat ){
		if( (mv_mat == null) || (mv_mat == undefined) ){
			mv_mat = this.view_mat;
		}
		if( (p_mat == null) || (p_mat == undefined) ){
			p_mat = this.proj_mat;
		}

		this.project_in[0] = obj_x * mv_mat[ 0] + obj_y * mv_mat[ 1] + obj_z * mv_mat[ 2] + mv_mat[ 3];
		this.project_in[1] = obj_x * mv_mat[ 4] + obj_y * mv_mat[ 5] + obj_z * mv_mat[ 6] + mv_mat[ 7];
		this.project_in[2] = obj_x * mv_mat[ 8] + obj_y * mv_mat[ 9] + obj_z * mv_mat[10] + mv_mat[11];
		this.project_in[3] = obj_x * mv_mat[12] + obj_y * mv_mat[13] + obj_z * mv_mat[14] + mv_mat[15];

		this.project_out[0] = this.project_in[0] * p_mat[ 0] + this.project_in[1] * p_mat[ 1] + this.project_in[2] * p_mat[ 2] + this.project_in[3] * p_mat[ 3];
		this.project_out[1] = this.project_in[0] * p_mat[ 4] + this.project_in[1] * p_mat[ 5] + this.project_in[2] * p_mat[ 6] + this.project_in[3] * p_mat[ 7];
		this.project_out[2] = this.project_in[0] * p_mat[ 8] + this.project_in[1] * p_mat[ 9] + this.project_in[2] * p_mat[10] + this.project_in[3] * p_mat[11];
		this.project_out[3] = this.project_in[0] * p_mat[12] + this.project_in[1] * p_mat[13] + this.project_in[2] * p_mat[14] + this.project_in[3] * p_mat[15];
		if( this.project_out[3] == 0.0 ){
			return false;
		}

		this.project_x = ((this.project_out[0] / this.project_out[3] + 1.0) / 2.0) * this.viewport_mat[2] + this.viewport_mat[0];
		this.project_y = ((this.project_out[1] / this.project_out[3] + 1.0) / 2.0) * this.viewport_mat[3] + this.viewport_mat[1];
		this.project_z =  (this.project_out[2] / this.project_out[3] + 1.0) / 2.0;

		return true;
	},

	/*
	 * gluUnProject
	 */
	unProject : function( win_x, win_y, win_z, mv_mat, p_mat ){
		if( (mv_mat == null) || (mv_mat == undefined) ){
			mv_mat = this.view_mat;
		}
		if( (p_mat == null) || (p_mat == undefined) ){
			p_mat = this.proj_mat;
		}

		this.set( p_mat );
		this.multiply( mv_mat );
		this.invert();

		this.project_in[0] = (win_x - this.viewport_mat[0]) * 2.0 / this.viewport_mat[2] - 1.0;
		this.project_in[1] = (win_y - this.viewport_mat[1]) * 2.0 / this.viewport_mat[3] - 1.0;
		this.project_in[2] = win_z * 2.0 - 1.0;

		this.project_out[0] = this.project_in[0] * this.util_mat[ 0] + this.project_in[1] * this.util_mat[ 1] + this.project_in[2] * this.util_mat[ 2] + this.util_mat[ 3];
		this.project_out[1] = this.project_in[0] * this.util_mat[ 4] + this.project_in[1] * this.util_mat[ 5] + this.project_in[2] * this.util_mat[ 6] + this.util_mat[ 7];
		this.project_out[2] = this.project_in[0] * this.util_mat[ 8] + this.project_in[1] * this.util_mat[ 9] + this.project_in[2] * this.util_mat[10] + this.util_mat[11];
		this.project_out[3] = this.project_in[0] * this.util_mat[12] + this.project_in[1] * this.util_mat[13] + this.project_in[2] * this.util_mat[14] + this.util_mat[15];
		if( this.project_out[3] == 0.0 ){
			return false;
		}

		this.project_x = this.project_out[0] / this.project_out[3];
		this.project_y = this.project_out[1] / this.project_out[3];
		this.project_z = this.project_out[2] / this.project_out[3];

		return true;
	},

	transX : function(){
		return this.trans_x;
	},
	transY : function(){
		return this.trans_y;
	},
	transZ : function(){
		return this.trans_z;
	},
	crossX : function(){
		return this.cross_x;
	},
	crossY : function(){
		return this.cross_y;
	},
	crossZ : function(){
		return this.cross_z;
	},
	normalizeX : function(){
		return this.normalize_x;
	},
	normalizeY : function(){
		return this.normalize_y;
	},
	normalizeZ : function(){
		return this.normalize_z;
	},
	reflectX : function(){
		return this.reflect_x;
	},
	reflectY : function(){
		return this.reflect_y;
	},
	reflectZ : function(){
		return this.reflect_z;
	},
	coordX : function( i ){
		return this.coord_x[i];
	},
	coordY : function( i ){
		return this.coord_y[i];
	},
	coordZ : function( i ){
		return this.coord_z[i];
	},
	normalX : function(){
		return this.normal_x;
	},
	normalY : function(){
		return this.normal_y;
	},
	normalZ : function(){
		return this.normal_z;
	},
	centerX : function(){
		return this.center_x;
	},
	centerY : function(){
		return this.center_y;
	},
	centerZ : function(){
		return this.center_z;
	},
	hitX : function(){
		return this.hit_x;
	},
	hitY : function(){
		return this.hit_y;
	},
	hitZ : function(){
		return this.hit_z;
	},
	positionX : function(){
		return this.position_x;
	},
	positionY : function(){
		return this.position_y;
	},
	positionZ : function(){
		return this.position_z;
	},
	projectX : function(){
		return this.project_x;
	},
	projectY : function(){
		return this.project_y;
	},
	projectZ : function(){
		return this.project_z;
	}

};
