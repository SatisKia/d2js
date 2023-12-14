/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _GLTexture( img_array, gen_num ){
	var i;

	this._img_array = img_array;

	this._num = img_array.length;
	this._gen_num = gen_num;

	this._id = new Array( this._gen_num );
	_glu.genTextures( this._gen_num, this._id );
	this._gen = true;

	this._use_id = new Array( this._gen_num );
	for( i = 0; i < this._gen_num; i++ ){
		this._use_id[i] = false;
	}

	this._index2id = new Array( this._num );

	this._width = new Array( this._num );
	this._height = new Array( this._num );

	this._image_data = new Array( this._num );
	this._t_rgba = new Array( this._num );
	this._t_a = new Array( this._num );
	this._t_trans = new Array( this._num );
	this._t_alpha = new Array( this._num );

	// translate用
	this._tx = new Array( this._num );
	this._ty = new Array( this._num );
	this._apply_tx = new Array( this._num );
	this._apply_ty = new Array( this._num );

	for( i = 0; i < this._num; i++ ){
		this._index2id[i] = -1;

		this._image_data[i] = null;
		this._t_rgba[i] = null;
		this._t_a[i] = null;

		// translate用
		this._tx[i] = 0.0;
		this._ty[i] = 0.0;
		this._apply_tx[i] = 0;
		this._apply_ty[i] = 0;
	}
}

_GLTexture.prototype = {

	_SHIFTL : function( a ){
		return a * 0x1000000;
	},
	_SHIFTR : function( a ){
		return _DIV( a, 0x1000000 );
	},

	bindTexture : function( target, texture ){
		_glu.bindTexture( target, texture );
	},

	dispose : function(){
		for( var i = 0; i < this._num; i++ ){
			this.unuse( i );
		}

		if( this._gen ){
			_glu.deleteTextures( this._gen_num, this._id );
			this._gen = false;
		}
	},

	imageDataFromImage : function( image/*Image*/ ){
		var canvas = document.createElement( "canvas" );
		var context = canvas.getContext( "2d" );
		canvas.width = image.width;
		canvas.height = image.height;
		context.drawImage( image, 0, 0 );
		return context.getImageData( 0, 0, canvas.width, canvas.height );
	},
	imageDataFromPixels : function( pixels, width, height ){
		var canvas = document.createElement( "canvas" );
		var context = canvas.getContext( "2d" );
		canvas.width = width;
		canvas.height = height;
		var x, y, yy;
		var tmp, r, g, b, a;
		for( y = 0; y < height; y++ ){
			yy = y * width;
			for( x = 0; x < width; x++ ){
				tmp = pixels[yy + x];
//				r = (tmp >> 24) & 0xff;
				r = this._SHIFTR(tmp) & 0xff;
				g = (tmp >> 16) & 0xff;
				b = (tmp >>  8) & 0xff;
				a =  tmp        & 0xff;
				context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
				context.fillRect( x, y, 1, 1 );
			}
		}
		return context.getImageData( 0, 0, canvas.width, canvas.height );
	},

	getTextureSize : function( size ){
		var tmp = 1;
		while( true ){
			if( tmp >= size ){
				break;
			}
			tmp *= 2;
		}
		return tmp;
	},

	use : function( index, use_trans ){
		if( this._index2id[index] >= 0 ){
			return;
		}

		if( use_trans == undefined ){
			use_trans = false;
		}

		var i;

		this._index2id[index] = 0;
		for( i = 0; i < this._gen_num; i++ ){
			if( !this._use_id[i] ){
				this._use_id[i] = true;
				this._index2id[index] = i;
				break;
			}
		}

		// 画像ファイル読み込み
		this._image_data[index] = this.imageDataFromImage( this._img_array[index] );
		this._width [index] = this._image_data[index].width;
		this._height[index] = this._image_data[index].height;
		if( use_trans ){
			var len = this._width[index] * this._height[index];
			this._t_rgba[index] = new Array( len );
			this._t_a[index] = new Array( len );
			var data = this._image_data[index].data;
			for( i = 0; i < len; i++ ){
//				this._t_rgba[index][i] = (data[i * 4] << 24) | (data[i * 4 + 1] << 16) | (data[i * 4 + 2] << 8) | data[i * 4 + 3];
				this._t_rgba[index][i] = this._SHIFTL(data[i * 4]) + (data[i * 4 + 1] << 16) + (data[i * 4 + 2] << 8) + data[i * 4 + 3];
				this._t_a[index][i] = data[i * 4 + 3];	// アルファ値を保持
			}
		}

		this._t_trans[index] = 1.0;
		this._t_alpha[index] = glTextureAlphaFlag( index );

		// テクスチャを構築する
		_glu.bindTexture( /*_gl.TEXTURE_2D,*/ this._id[this._index2id[index]] );
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
		_glu.texImage2D( /*_gl.TEXTURE_2D,*/ this._image_data[index] );

		_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MAG_FILTER, glTextureFilter( _gl, index ) );
		_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_MIN_FILTER, glTextureFilter( _gl, index ) );
		_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_S, glTextureWrap( _gl, index ) );
		_gl.texParameteri( _gl.TEXTURE_2D, _gl.TEXTURE_WRAP_T, glTextureWrap( _gl, index ) );
	},

	unuse : function( index ){
		if( this._index2id[index] >= 0 ){
			this._use_id[this._index2id[index]] = false;

			this._image_data[index] = null;
			this._t_rgba[index] = null;
			this._t_a[index] = null;

			this._index2id[index] = -1;
		}
	},

	unuseAll : function(){
		for( var i = 0; i < this._num; i++ ){
			this.unuse( i );
		}

		_glu.deleteTextures( this._gen_num, this._id );
		_glu.genTextures( this._gen_num, this._id );
	},

	update : function( index, pixels, length ){
		if( this._index2id[index] >= 0 ){
			var len = this._width[index] * this._height[index];
			if( length == len ){
				this._image_data[index] = this.imageDataFromPixels( pixels, this._width[index], this._height[index] );

				if( (this._t_rgba[index] != null) && (this._t_a[index] != null) ){
					_System.arraycopy( pixels, 0, this._t_rgba[index], 0, len );
					for( var i = 0; i < len; i++ ){
						this._t_a[index][i] = this._t_rgba[index][i] & 0xff;	// アルファ値を保持
					}
				}

				this._t_trans[index] = 1.0;
				this._t_alpha[index] = glTextureAlphaFlag( index );

				// テクスチャを再構築する
				_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
				_glu.bindTexture( /*_gl.TEXTURE_2D,*/ this._id[this._index2id[index]] );
				_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
				_glu.texImage2D( /*_gl.TEXTURE_2D,*/ this._image_data[index] );
			}
		}
	},

	setTransparency : function( index, trans ){
		if( (this._t_rgba[index] == null) || (this._t_a[index] == null) ){
			return;
		}

		this.use( index );

		if( trans == this._t_trans[index] ){
			return;
		}
		this._t_trans[index] = trans;

		// アルファ値を操作する
		var len = this._width[index] * this._height[index];
		var r, g, b, a;
		for( var i = 0; i < len; i++ ){
//			r = (this._t_rgba[index][i] >> 24) & 0xff;
			r = this._SHIFTR(this._t_rgba[index][i]) & 0xff;
			g = (this._t_rgba[index][i] >> 16) & 0xff;
			b = (this._t_rgba[index][i] >>  8) & 0xff;
			a = _INT( this._t_a[index][i] * this._t_trans[index] );
//			this._t_rgba[index][i] = (r << 24) | (g << 16) | (b << 8) | a;
			this._t_rgba[index][i] = this._SHIFTL(r) + (g << 16) + (b << 8) + a;
		}
		this._image_data[index] = this.imageDataFromPixels( this._t_rgba[index], this._width[index], this._height[index] );

		this._t_alpha[index] = (this._t_trans[index] == 1.0) ? glTextureAlphaFlag( index ) : true;

		// テクスチャを再構築する
		_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
		_glu.bindTexture( /*_gl.TEXTURE_2D,*/ this._id[this._index2id[index]] );
		_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
		_glu.texImage2D( /*_gl.TEXTURE_2D,*/ this._image_data[index] );
	},

	/*
	 * glTranslatef
	 */
	translate : function( index, x, y ){
		this.use( index );

		var width  = this._width [index];
		var height = this._height[index];

		this._tx[index] = x * width;
		this._ty[index] = y * height;
		var dx = this._apply_tx[index] - _INT( this._tx[index] );
		var dy = this._apply_ty[index] - _INT( this._ty[index] );
		var repeat = (glTextureWrap( _gl, index ) == _gl.REPEAT);

		var i, j, k;

		if( dx != 0 ){
			this._apply_tx[index] = _INT( this._tx[index] );
			var tmp = new Array( width * 4 );
			var data = this._image_data[index].data;
			var pos;
			for( i = 0; i < height; i++ ){
				pos = i * width;
				for( j = 0; j < width; j++ ){
					k = j - dx;
					if( !repeat ){
						if( (k < 0) || (k >= width) ){
							tmp[j * 4    ] = 0;
							tmp[j * 4 + 1] = 0;
							tmp[j * 4 + 2] = 0;
							tmp[j * 4 + 3] = 0;
						} else {
							tmp[j * 4    ] = data[(pos + k) * 4    ];
							tmp[j * 4 + 1] = data[(pos + k) * 4 + 1];
							tmp[j * 4 + 2] = data[(pos + k) * 4 + 2];
							tmp[j * 4 + 3] = data[(pos + k) * 4 + 3];
						}
					} else {
						while( k < 0 ){
							k += width;
						}
						while( k >= width ){
							k -= width;
						}
						tmp[j * 4    ] = data[(pos + k) * 4    ];
						tmp[j * 4 + 1] = data[(pos + k) * 4 + 1];
						tmp[j * 4 + 2] = data[(pos + k) * 4 + 2];
						tmp[j * 4 + 3] = data[(pos + k) * 4 + 3];
					}
				}
				_System.arraycopy( tmp, 0, data, pos * 4, width * 4 );
			}
		}
		if( dy != 0 ){
			this._apply_ty[index] = _INT( this._ty[index] );
			var tmp = new Array( height );
			for( i = 0; i < height; i++ ){
				tmp[i] = new Array( width * 4 );
			}
			var data = this._image_data[index].data;
			for( i = 0; i < height; i++ ){
				k = i - dy;
				if( !repeat ){
					if( (k < 0) || (k >= width) ){
						for( j = 0; j < width; j++ ){
							tmp[i][j * 4    ] = 0;
							tmp[i][j * 4 + 1] = 0;
							tmp[i][j * 4 + 2] = 0;
							tmp[i][j * 4 + 3] = 0;
						}
					} else {
						_System.arraycopy( data, k * width * 4, tmp[i], 0, width * 4 );
					}
				} else {
					while( k < 0 ){
						k += height;
					}
					while( k >= height ){
						k -= height;
					}
					_System.arraycopy( data, k * width * 4, tmp[i], 0, width * 4 );
				}
			}
			for( i = 0; i < height; i++ ){
				_System.arraycopy( tmp[i], 0, data, i * width * 4, width * 4 );
			}
		}

		if( (dx != 0) || (dy != 0) ){
			if( (this._t_rgba[index] != null) && (this._t_a[index] != null) ){
				var len = width * height;
				var data = this._image_data[index].data;
				for( i = 0; i < len; i++ ){
//					this._t_rgba[index][i] = (data[i * 4] << 24) | (data[i * 4 + 1] << 16) | (data[i * 4 + 2] << 8) | data[i * 4 + 3];
					this._t_rgba[index][i] = this._SHIFTL(data[i * 4]) + (data[i * 4 + 1] << 16) + (data[i * 4 + 2] << 8) + data[i * 4 + 3];
					this._t_a[index][i] = data[i * 4 + 3];	// アルファ値を保持
				}

				// アルファ値を操作する
				var r, g, b, a;
				for( i = 0; i < len; i++ ){
//					r = (this._t_rgba[index][i] >> 24) & 0xff;
					r = this._SHIFTR(this._t_rgba[index][i]) & 0xff;
					g = (this._t_rgba[index][i] >> 16) & 0xff;
					b = (this._t_rgba[index][i] >>  8) & 0xff;
					a = _INT( this._t_a[index][i] * this._t_trans[index] );
//					this._t_rgba[index][i] = (r << 24) | (g << 16) | (b << 8) | a;
					this._t_rgba[index][i] = this._SHIFTL(r) + (g << 16) + (b << 8) + a;
				}
				this._image_data[index] = this.imageDataFromPixels( this._t_rgba[index], width, height );
			}

			// テクスチャを再構築する
			_gl.pixelStorei( _gl.UNPACK_ALIGNMENT, 1 );
			_glu.bindTexture( /*_gl.TEXTURE_2D,*/ this._id[this._index2id[index]] );
			_gl.pixelStorei( _gl.UNPACK_FLIP_Y_WEBGL, glTextureFlipY( index ) );
			_glu.texImage2D( /*_gl.TEXTURE_2D,*/ this._image_data[index] );
		}
	},

	id : function( index ){
		return this._id[this._index2id[index]];
	},

	width : function( index ){
		return this._width[index];
	},

	height : function( index ){
		return this._height[index];
	},

	alpha : function( index ){
		return this._t_alpha[index];
	},

	depth : function( index ){
		return glTextureDepthFlag( index );
	}

};

//function glTextureAlphaFlag( index ){ return true; }
//function glTextureDepthFlag( index ){ return true; }
//function glTextureFlipY( index ){ return true; }
//function glTextureFilter( gl, index ){ return gl.LINEAR; }
//function glTextureWrap( gl, index ){ return gl.CLAMP_TO_EDGE; }
