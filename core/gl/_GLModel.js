/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_GLPrimitive.h"

function _GLModel( id, depth, lighting ){
	this._glp = new _GLPrimitive();
	this._glp.setType( _GLPRIMITIVE_TYPE_MODEL );
	this._glp.setDepth( depth );

	this._id = id;
	this._lighting = lighting;

	// マテリアル
	this._material_num = 0;
	this._material_texture = null;
	this._material_diffuse = null;	// R、G、B、Aを各0～1
	this._material_ambient = null;	// R、G、B、Aを各0～1
	this._material_emission = null;	// R、G、B、Aを各0～1
	this._material_specular = null;	// R、G、B、Aを各0～1
	this._material_shininess = null;	// 0～128

	// オブジェクト
	this._object_num = 0;
	this._coord = null;		// X、Y、Z
	this._normal = null;	// X、Y、Z
	this._color = null;		// R、G、B、Aを各0～1
	this._map = null;		// U、V
	this._radius = 0.0;

	// 三角形ストリップ
	this._strip_num = 0;
	this._strip_material = null;
	this._strip_coord = null;
	this._strip_normal = null;
	this._strip_color = null;
	this._strip_map = null;
	this._strip_len = null;
	this._strip = null;
	this._strip_tx = null;
	this._strip_ty = null;
	this._strip_tz = null;
	this._strip_or = null;
	this._strip_ox = null;
	this._strip_oy = null;
	this._strip_oz = null;

	this._texture_env_mode_flag = false;
	this._texture_env_mode = 0;

	this._position_buffer = null;
	this._normal_buffer = null;
	this._color_buffer = null;
	this._texture_coord_buffer = null;
	this._strip_buffer = null;
}

_GLModel.prototype = {

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
	lighting : function(){
		return this._lighting;
	},

	setMaterial : function( num, texture/*int[]*/, diffuse/*float[]*/, ambient/*float[]*/, emission/*float[]*/, specular/*float[]*/, shininess/*float[]*/ ){
		this._material_num = num;
		this._material_texture = texture;
		this._material_diffuse = diffuse;
		this._material_ambient = ambient;
		this._material_emission = emission;
		this._material_specular = specular;
		this._material_shininess = shininess;
	},

	setObject : function( num, coord/*float[][]*/, normal/*float[][]*/, color/*float[][]*/, map/*float[][]*/, radius ){
		this._object_num = num;
		this._coord = coord;
		this._normal = normal;
		this._color = color;
		this._map = map;
		this._radius = radius;
	},

	setStrip : function( num, material/*int[]*/, coord/*int[]*/, normal/*int[]*/, color/*int[]*/, map/*int[]*/, len/*int[]*/, strip/*short[][]*/ ){
		this._strip_num = num;
		this._strip_material = material;
		this._strip_coord = coord;
		this._strip_normal = normal;
		this._strip_color = color;
		this._strip_map = map;
		this._strip_len = len;
		this._strip = strip;
	},
	setStripTranslate : function( tx, ty, tz ){
		this._strip_tx = tx;
		this._strip_ty = ty;
		this._strip_tz = tz;
	},
	setStripRotate : function( or, ox, oy, oz ){
		this._strip_or = or;
		this._strip_ox = ox;
		this._strip_oy = oy;
		this._strip_oz = oz;
	},

	setTextureEnvMode : function( mode ){
		this._texture_env_mode_flag = true;
		this._texture_env_mode = mode;
	},

	stripNum : function(){
		return this._strip_num;
	},

	stripTranslate : function( index ){
		_glu.translate( this._strip_tx[index], this._strip_ty[index], this._strip_tz[index] );
	},
	stripRotate : function( index ){
		_glu.rotate( this._strip_or[index], this._strip_ox[index], this._strip_oy[index], this._strip_oz[index] );
	},

	textureIndex : function( index ){
		if( this._strip_material[index] < 0 ){
			return -1;
		}
		return this._material_texture[this._strip_material[index]];
	},

	textureAlpha : function( glt/*_GLTexture*/, index, tex_index ){
		var alpha = false;
		var depth = this.depth();
		if( tex_index < 0 ){
			tex_index = this.textureIndex( index );
		}
		if( tex_index >= 0 ){
			glt.use( tex_index );
			glt.setTransparency( tex_index, this.transparency() );
			alpha = glt.alpha( tex_index );
			if( depth ){
				// モデル全体でデプスバッファ描き込みモードになっている場合のみ、
				// テクスチャ個別のモードを見る。
				depth = glt.depth( tex_index );
			}
		}
		return (alpha && !depth);
	},

	draw : function( glt/*_GLTexture*/, index, tex_index, alpha ){
		var alpha2 = this.textureAlpha( glt, index, tex_index );
		if( this.transparency() != 1.0 ){
			alpha2 = true;
		}
		if( alpha2 != alpha ){
			return;
		}

		if( this._strip_coord[index] >= 0 ){
			this._position_buffer = _gl.createBuffer();
			_gl.bindBuffer( _gl.ARRAY_BUFFER, this._position_buffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( this._coord[this._strip_coord[index]] ), _gl.STATIC_DRAW );
			glModelBindPositionBuffer( _gl, this._id, this._lighting );
			_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
		}

		if( (this._normal != null) && (this._strip_normal[index] >= 0) ){
			this._normal_buffer = _gl.createBuffer();
			_gl.bindBuffer( _gl.ARRAY_BUFFER, this._normal_buffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( this._normal[this._strip_normal[index]] ), _gl.STATIC_DRAW );
			glModelBindNormalBuffer( _gl, this._id, this._lighting );
			_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
		}

		if( (this._color != null) && (this._strip_color[index] >= 0) ){
			var color;
			var trans = this.transparency();
			if( trans != 1.0 ){
				var tmp = this._color[this._strip_color[index]];
				color = new Array( tmp.length );
				for( var i = 0; i < tmp.length; i += 4 ){
					color[i    ] = tmp[i    ];
					color[i + 1] = tmp[i + 1];
					color[i + 2] = tmp[i + 2];
					color[i + 3] = tmp[i + 3] * trans;
				}
			} else {
				color = this._color[this._strip_color[index]];
			}
			this._color_buffer = _gl.createBuffer();
			_gl.bindBuffer( _gl.ARRAY_BUFFER, this._color_buffer );
			_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( color ), _gl.STATIC_DRAW );
			glModelBindColorBuffer( _gl, this._id, this._lighting );
			_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
		}

		if( tex_index < 0 ){
			tex_index = this.textureIndex( index );
		}
		if( !glModelSetTexture( _gl, glt, index, tex_index, this._id, this._lighting ) ){
			if( (this._map != null) && (this._strip_map[index] >= 0) && (tex_index >= 0) ){
				_gl.activeTexture( glModelActiveTexture( _gl, this._id ) );
				glt.bindTexture( _gl.TEXTURE_2D, glt.id( tex_index ) );
				this._texture_coord_buffer = _gl.createBuffer();
				_gl.bindBuffer( _gl.ARRAY_BUFFER, this._texture_coord_buffer );
				_gl.bufferData( _gl.ARRAY_BUFFER, new Float32Array( this._map[this._strip_map[index]] ), _gl.STATIC_DRAW );
				glModelBindTextureCoordBuffer( _gl, this._id, this._lighting );
				_gl.bindBuffer( _gl.ARRAY_BUFFER, null );
//				_gl.texEnvf( _gl.TEXTURE_ENV, _gl.TEXTURE_ENV_MODE, this._texture_env_mode_flag ? this._texture_env_mode : _gl.MODULATE );
			}
		}

		var material_diffuse = null;
		var material_ambient = null;
		var material_emission = null;
		var material_specular = null;
		var material_shininess = null;
		if( (this._material_diffuse != null) && (this._strip_material[index] >= 0) ){
//			_gl.materialfv( _gl.FRONT_AND_BACK, _gl.DIFFUSE, this._material_diffuse, this._strip_material[index] * 4 );
			material_diffuse = new Array( 4 );
			material_diffuse[0] = this._material_diffuse[this._strip_material[index] * 4    ];
			material_diffuse[1] = this._material_diffuse[this._strip_material[index] * 4 + 1];
			material_diffuse[2] = this._material_diffuse[this._strip_material[index] * 4 + 2];
			material_diffuse[3] = this._material_diffuse[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_ambient != null) && (this._strip_material[index] >= 0) ){
//			_gl.materialfv( _gl.FRONT_AND_BACK, _gl.AMBIENT, this._material_ambient, this._strip_material[index] * 4 );
			material_ambient = new Array( 4 );
			material_ambient[0] = this._material_ambient[this._strip_material[index] * 4    ];
			material_ambient[1] = this._material_ambient[this._strip_material[index] * 4 + 1];
			material_ambient[2] = this._material_ambient[this._strip_material[index] * 4 + 2];
			material_ambient[3] = this._material_ambient[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_emission != null) && (this._strip_material[index] >= 0) ){
//			_gl.materialfv( _gl.FRONT_AND_BACK, _gl.EMISSION, this._material_emission, this._strip_material[index] * 4 );
			material_emission = new Array( 4 );
			material_emission[0] = this._material_emission[this._strip_material[index] * 4    ];
			material_emission[1] = this._material_emission[this._strip_material[index] * 4 + 1];
			material_emission[2] = this._material_emission[this._strip_material[index] * 4 + 2];
			material_emission[3] = this._material_emission[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_specular != null) && (this._strip_material[index] >= 0) ){
//			_gl.materialfv( _gl.FRONT_AND_BACK, _gl.SPECULAR, this._material_specular, this._strip_material[index] * 4 );
			material_specular = new Array( 4 );
			material_specular[0] = this._material_specular[this._strip_material[index] * 4    ];
			material_specular[1] = this._material_specular[this._strip_material[index] * 4 + 1];
			material_specular[2] = this._material_specular[this._strip_material[index] * 4 + 2];
			material_specular[3] = this._material_specular[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_shininess != null) && (this._strip_material[index] >= 0) ){
//			_gl.materialf( _gl.FRONT_AND_BACK, _gl.SHININESS, this._material_shininess[this._strip_material[index]] );
			material_shininess = this._material_shininess[this._strip_material[index]];
		}

//		if( glt.alpha( tex_index ) ){
//			_gl.enable( _gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			_gl.disable( _gl.CULL_FACE );
			_gl.enable( _gl.BLEND );
			_gl.depthMask( false );
		}

//		if( this._lighting ){
//			_gl.enable( _gl.LIGHTING );
//		} else {
//			_gl.disable( _gl.LIGHTING );
//		}

		if( glModelBeginDraw( _gl, glt, index, tex_index, this._id, this._lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ) ){
			this._strip_buffer = _gl.createBuffer();
			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, this._strip_buffer );
			_gl.bufferData( _gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this._strip[index] ), _gl.STATIC_DRAW );
			var count = _gl.getBufferParameter( _gl.ELEMENT_ARRAY_BUFFER, _gl.BUFFER_SIZE ) / 2/*UNSIGNED_SHORT*/;
			_gl.drawElements( _gl.TRIANGLE_STRIP, count, _gl.UNSIGNED_SHORT, 0 );
			_gl.bindBuffer( _gl.ELEMENT_ARRAY_BUFFER, null );

			glModelEndDraw( _gl, glt, index, tex_index, this._id, this._lighting );
		}

//		if( glt.alpha( tex_index ) ){
//			_gl.disable( _gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			_gl.enable( _gl.CULL_FACE );
			_gl.disable( _gl.BLEND );
			_gl.depthMask( true );
		}
	},

	radius : function(){
		return this._radius;
	},

};

function _GLModelData( data ){
	this._data = data;
	this._cur = 0;
}
_GLModelData.prototype = {
	get : function(){
		if( typeof this._data == "string" ){
			var tmp = "";
			var chr;
			while( (chr = this._data.charAt( this._cur++ )) != "," ){
				tmp += chr;
				if( this._cur >= this._data.length ){
					break;
				}
			}
			if( tmp.length > 0 ){
				if( tmp.charAt( 0 ) == "." ){
					return Number( "0" + tmp );
				} else if( tmp.charAt( 0 ) == "-" ){
					if( (tmp.length > 1) && (tmp.charAt( 1 ) == ".") ){
						return Number( "-0" + tmp.substring( 1 ) );
					}
				}
				return Number( tmp );
			}
			return 0;
		}
		return this._data[this._cur++];
	}
};
function createGLModel( _data, scale, id, depth, lighting ){
	var data;
	if( _data instanceof _GLModelData ){
		data = _data;
	} else {
		data = new _GLModelData( _data );
	}

	var model = new _GLModel( id, depth, lighting );

	var i, j, k;
	var coord_count;
	var normal_count;
	var color_count;
	var map_count;

	// テクスチャ
	var texture_num = data.get();
	var texture_index = new Array(texture_num);
	var material_dif = new Array(texture_num * 4);
	var material_amb = new Array(texture_num * 4);
	var material_emi = new Array(texture_num * 4);
	var material_spc = new Array(texture_num * 4);
	var material_power = new Array(texture_num);
	for ( i = 0; i < texture_num; i++ ) {
		texture_index[i] = data.get();
		material_dif[i * 4] = data.get();
		material_dif[i * 4 + 1] = material_dif[i * 4];
		material_dif[i * 4 + 2] = material_dif[i * 4];
		material_dif[i * 4 + 3] = 1.0;
		material_amb[i * 4] = data.get();
		material_amb[i * 4 + 1] = material_amb[i * 4];
		material_amb[i * 4 + 2] = material_amb[i * 4];
		material_amb[i * 4 + 3] = 1.0;
		material_emi[i * 4] = data.get();
		material_emi[i * 4 + 1] = material_emi[i * 4];
		material_emi[i * 4 + 2] = material_emi[i * 4];
		material_emi[i * 4 + 3] = 1.0;
		material_spc[i * 4] = data.get();
		material_spc[i * 4 + 1] = material_spc[i * 4];
		material_spc[i * 4 + 2] = material_spc[i * 4];
		material_spc[i * 4 + 3] = 1.0;
		material_power[i] = data.get() * 128.0 / 100.0;
	}
	model.setMaterial(texture_num, texture_index, material_dif, material_amb, material_emi, material_spc, material_power);

	// グループ
	var group_tx = data.get() * scale;
	var group_ty = data.get() * scale;
	var group_tz = data.get() * scale;
	var group_or = data.get();
	var group_ox = data.get();
	var group_oy = data.get();
	var group_oz = data.get();
	_glu.setIdentity();
	_glu.translate(group_tx, group_ty, group_tz);
	_glu.rotate(group_ox, group_oy, group_oz, group_or);

	var x, y, z;
	var tx, ty, tz, r;
	var radius = 0.0;

	// coord
	var coord_num = data.get();
	coord_count = null;
	var coord = null;
	if ( coord_num > 0 ) {
		coord_count = new Array(coord_num);
		coord = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			coord_count[j] = data.get();
			if ( coord_count[j] <= 0 ) {
				coord[j] = null;
			} else {
				coord[j] = new Array(coord_count[j] * 3);
				for ( i = 0; i < coord_count[j]; i++ ) {
					x = data.get() * scale;
					y = data.get() * scale;
					z = data.get() * scale;
					_glu.transVector(x, y, z);
					tx = _glu.transX();
					ty = _glu.transY();
					tz = _glu.transZ();
					r = tx * tx + ty * ty + tz * tz;
					if ( r > radius ) {
						radius = r;
					}
					coord[j][i * 3    ] = tx;
					coord[j][i * 3 + 1] = ty;
					coord[j][i * 3 + 2] = tz;
				}
			}
		}
	}

	radius = Math.sqrt(radius);

	// normal
	var num = data.get();
	normal_count = null;
	var normal = null;
	if ( num > 0 ) {
		normal_count = new Array(coord_num);
		normal = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			normal_count[j] = data.get();
			if ( normal_count[j] <= 0 ) {
				normal[j] = null;
			} else {
				normal[j] = new Array(normal_count[j] * 3);
				for ( i = 0; i < normal_count[j]; i++ ) {
					x = data.get();
					y = data.get();
					z = data.get();
					_glu.transVector(x, y, z);
					normal[j][i * 3    ] = _glu.transX();
					normal[j][i * 3 + 1] = _glu.transY();
					normal[j][i * 3 + 2] = _glu.transZ();
				}
			}
		}
	}

	// color
	num = data.get();
	color_count = null;
	var color = null;
	if ( num > 0 ) {
		color_count = new Array(coord_num);
		color = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			color_count[j] = data.get();
			if ( color_count[j] <= 0 ) {
				color[j] = null;
			} else {
				color[j] = new Array(color_count[j] * 4);
				for ( i = 0; i < color_count[j]; i++ ) {
					color[j][i * 4    ] = data.get();
					color[j][i * 4 + 1] = data.get();
					color[j][i * 4 + 2] = data.get();
					color[j][i * 4 + 3] = 1.0;
				}
			}
		}
	}

	// map
	num = data.get();
	map_count = null;
	var map = null;
	if ( num > 0 ) {
		map_count = new Array(coord_num);
		map = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			map_count[j] = data.get();
			if ( map_count[j] <= 0 ) {
				map[j] = null;
			} else {
				map[j] = new Array(map_count[j] * 2);
				for ( i = 0; i < map_count[j]; i++ ) {
					map[j][i * 2    ] = data.get();
					map[j][i * 2 + 1] = data.get();
				}
			}
		}
	}

	model.setObject(coord_num, coord, normal, color, map, radius);

	// 三角形ストリップ
	var strip_num = data.get();
	var strip_tx = new Array(strip_num);	// translation
	var strip_ty = new Array(strip_num);
	var strip_tz = new Array(strip_num);
	var strip_or = new Array(strip_num);	// orientation
	var strip_ox = new Array(strip_num);
	var strip_oy = new Array(strip_num);
	var strip_oz = new Array(strip_num);
	var strip_texture = new Array(strip_num);
	var strip_coord = new Array(strip_num);
	var strip_normal = new Array(strip_num);
	var strip_color = new Array(strip_num);
	var strip_map = new Array(strip_num);
	var strip_len = new Array(strip_num);
	var strip = new Array(strip_num);
	for ( j = 0; j < strip_num; j++ ) {
		strip_tx[j] = data.get() * scale;
		strip_ty[j] = data.get() * scale;
		strip_tz[j] = data.get() * scale;
		strip_or[j] = data.get();
		strip_ox[j] = data.get();
		strip_oy[j] = data.get();
		strip_oz[j] = data.get();
		strip_texture[j] = data.get();
		strip_coord[j] = data.get();
		strip_normal[j] = data.get();
		strip_color[j] = data.get();
		strip_map[j] = data.get();
		strip_len[j] = data.get();
		strip[j] = new Array(strip_len[j]);
		for ( k = 0; k < strip_len[j]; k++ ) {
			strip[j][k] = data.get();
		}
	}
	model.setStrip(strip_num, strip_texture, strip_coord, strip_normal, strip_color, strip_map, strip_len, strip);
	model.setStripTranslate( strip_tx, strip_ty, strip_tz );
	model.setStripRotate( strip_or, strip_ox, strip_oy, strip_oz );

	return model;
}

//function glModelActiveTexture( gl, id ){ return gl.TEXTURE0; }
//function glModelBindPositionBuffer( gl, id, lighting ){}
//function glModelBindNormalBuffer( gl, id, lighting ){}
//function glModelBindColorBuffer( gl, id, lighting ){}
//function glModelBindTextureCoordBuffer( gl, id, lighting ){}
//function glModelSetTexture( gl, glt/*_GLTexture*/, index, tex_index, id, lighting ){ return false; }
//function glModelBeginDraw( gl, glt/*_GLTexture*/, index, tex_index, id, lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ){ return true; }
//function glModelEndDraw( gl, glt/*_GLTexture*/, index, tex_index, id, lighting ){}
