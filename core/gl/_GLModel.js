/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

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

	setMaterial : function( num, texture/*int[]*/, diffuse/*float[]*/, ambient/*float[]*/, emission/*float[]*/, specular/*float[]*/, shininess/*float[]*/ ){
		this._material_num = num;
		this._material_texture = texture;
		this._material_diffuse = diffuse;
		this._material_ambient = ambient;
		this._material_emission = emission;
		this._material_specular = specular;
		this._material_shininess = shininess;
	},

	setObject : function( num, coord/*float[][]*/, normal/*float[][]*/, color/*float[][]*/, map/*float[][]*/ ){
		this._object_num = num;
		this._coord = coord;
		this._normal = normal;
		this._color = color;
		this._map = map;
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

	textureIndex : function( index ){
		if( this._strip_material[index] < 0 ){
			return -1;
		}
		return this._material_texture[this._strip_material[index]];
	},

	textureAlpha : function( glt/*_GLTexture*/, index, tex_index ){
		var alpha = false;
		var depth = this._glp.depth();
		if( tex_index < 0 ){
			tex_index = this.textureIndex( index );
		}
		if( tex_index >= 0 ){
			glt.use( tex_index );
			glt.setTransparency( tex_index, this._glp.transparency() );
			alpha = glt.alpha( tex_index );
			if( depth ){
				// モデル全体でデプスバッファ描き込みモードになっている場合のみ、
				// テクスチャ個別のモードを見る。
				depth = glt.depth( tex_index );
			}
		}
		return (alpha && !depth);
	},

	draw : function( gl, glt/*_GLTexture*/, index, tex_index, alpha ){
		var alpha2 = this.textureAlpha( glt, index, tex_index );
		if( this._glp.transparency() != 255 ){
			alpha2 = true;
		}
		if( alpha2 != alpha ){
			return;
		}

		if( this._strip_coord[index] >= 0 ){
			this._position_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, this._position_buffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._coord[this._strip_coord[index]] ), gl.STATIC_DRAW );
			glModelBindPositionBuffer( gl, this._id, this._lighting );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		if( (this._normal != null) && (this._strip_normal[index] >= 0) ){
			this._normal_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, this._normal_buffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._normal[this._strip_normal[index]] ), gl.STATIC_DRAW );
			glModelBindNormalBuffer( gl, this._id, this._lighting );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		if( (this._color != null) && (this._strip_color[index] >= 0) ){
			this._color_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, this._color_buffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._color[this._strip_color[index]] ), gl.STATIC_DRAW );
			glModelBindColorBuffer( gl, this._id, this._lighting );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}

		if( tex_index < 0 ){
			tex_index = this.textureIndex( index );
		}
		if( !glModelSetTexture( gl, glt, index, tex_index, this._id, this._lighting ) ){
			if( (this._map != null) && (this._strip_map[index] >= 0) && (tex_index >= 0) ){
				gl.activeTexture( gl.TEXTURE0 );
				glt.bindTexture( gl.TEXTURE_2D, glt.id( tex_index ) );
				this._texture_coord_buffer = gl.createBuffer();
				gl.bindBuffer( gl.ARRAY_BUFFER, this._texture_coord_buffer );
				gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( this._map[this._strip_map[index]] ), gl.STATIC_DRAW );
				glModelBindTextureCoordBuffer( gl, this._id, this._lighting );
				gl.bindBuffer( gl.ARRAY_BUFFER, null );
//				gl.texEnvf( gl.TEXTURE_ENV, gl.TEXTURE_ENV_MODE, this._texture_env_mode_flag ? this._texture_env_mode : gl.MODULATE );
			}
		}

		var material_diffuse = null;
		var material_ambient = null;
		var material_emission = null;
		var material_specular = null;
		var material_shininess = null;
		if( (this._material_diffuse != null) && (this._strip_material[index] >= 0) ){
//			gl.materialfv( gl.FRONT_AND_BACK, gl.DIFFUSE, this._material_diffuse, this._strip_material[index] * 4 );
			material_diffuse = new Array( 4 );
			material_diffuse[0] = this._material_diffuse[this._strip_material[index] * 4    ];
			material_diffuse[1] = this._material_diffuse[this._strip_material[index] * 4 + 1];
			material_diffuse[2] = this._material_diffuse[this._strip_material[index] * 4 + 2];
			material_diffuse[3] = this._material_diffuse[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_ambient != null) && (this._strip_material[index] >= 0) ){
//			gl.materialfv( gl.FRONT_AND_BACK, gl.AMBIENT, this._material_ambient, this._strip_material[index] * 4 );
			material_ambient = new Array( 4 );
			material_ambient[0] = this._material_ambient[this._strip_material[index] * 4    ];
			material_ambient[1] = this._material_ambient[this._strip_material[index] * 4 + 1];
			material_ambient[2] = this._material_ambient[this._strip_material[index] * 4 + 2];
			material_ambient[3] = this._material_ambient[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_emission != null) && (this._strip_material[index] >= 0) ){
//			gl.materialfv( gl.FRONT_AND_BACK, gl.EMISSION, this._material_emission, this._strip_material[index] * 4 );
			material_emission = new Array( 4 );
			material_emission[0] = this._material_emission[this._strip_material[index] * 4    ];
			material_emission[1] = this._material_emission[this._strip_material[index] * 4 + 1];
			material_emission[2] = this._material_emission[this._strip_material[index] * 4 + 2];
			material_emission[3] = this._material_emission[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_specular != null) && (this._strip_material[index] >= 0) ){
//			gl.materialfv( gl.FRONT_AND_BACK, gl.SPECULAR, this._material_specular, this._strip_material[index] * 4 );
			material_specular = new Array( 4 );
			material_specular[0] = this._material_specular[this._strip_material[index] * 4    ];
			material_specular[1] = this._material_specular[this._strip_material[index] * 4 + 1];
			material_specular[2] = this._material_specular[this._strip_material[index] * 4 + 2];
			material_specular[3] = this._material_specular[this._strip_material[index] * 4 + 3];
		}
		if( (this._material_shininess != null) && (this._strip_material[index] >= 0) ){
//			gl.materialf( gl.FRONT_AND_BACK, gl.SHININESS, this._material_shininess[this._strip_material[index]] );
			material_shininess = this._material_shininess[this._strip_material[index]];
		}

//		if( glt.alpha( tex_index ) ){
//			gl.enable( gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			gl.enable( gl.BLEND );
			gl.depthMask( false );
		}

//		if( this._lighting ){
//			gl.enable( gl.LIGHTING );
//		} else {
//			gl.disable( gl.LIGHTING );
//		}

		if( glModelBeginDraw( gl, glt, index, tex_index, this._id, this._lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ) ){
			this._strip_buffer = gl.createBuffer();
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this._strip_buffer );
			gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( this._strip[index] ), gl.STATIC_DRAW );
			var count = gl.getBufferParameter( gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE ) / 2/*UNSIGNED_SHORT*/;
			gl.drawElements( gl.TRIANGLE_STRIP, count, gl.UNSIGNED_SHORT, 0 );
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );

			glModelEndDraw( gl, glt, index, tex_index, this._id, this._lighting );
		}

//		if( glt.alpha( tex_index ) ){
//			gl.disable( gl.ALPHA_TEST );
//		}
		if( alpha2 ){
			gl.disable( gl.BLEND );
			gl.depthMask( true );
		}
	},

};

//function glModelBindPositionBuffer( gl, id, lighting ){}
//function glModelBindNormalBuffer( gl, id, lighting ){}
//function glModelBindColorBuffer( gl, id, lighting ){}
//function glModelBindTextureCoordBuffer( gl, id, lighting ){}
//function glModelSetTexture( gl, glt/*_GLTexture*/, index, tex_index, id, lighting ){ return false; }
//function glModelBeginDraw( gl, glt/*_GLTexture*/, index, tex_index, id, lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ){ return true; }
//function glModelEndDraw( gl, glt/*_GLTexture*/, index, tex_index, id, lighting ){}
