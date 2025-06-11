var glt;

var img_loaded = false;
var img_array = new Array();
var img_src = [
#include "data.txt"
];

var imageData;
var textureId;

var model;

function frameTime(){ return (disp_img || img_loaded) ? (1000 / 30/*フレーム*/) : 0; }

function init(){
	_USE_KEY = true;
	_USE_MOUSE = true;
}

function start(){
	setCurrent( "canvas0" );
	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 24, "ＭＳ ゴシック" );

	if( use_texture ){
		// テクスチャの読み込み
		if( isImageBusy() ){
			if( disp_img ){
				if( img_array.length > 1 ){
					g.drawImage( img_array[img_array.length - 2], 0, 0 );
				}
			}
			g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
			g.drawString( "" + img_array.length + " loading...", 10, 30 );
		} else if( img_array.length <= img_src.length ){
			var index = img_array.length;
			if( index > 0 ){
				if( disp_img ){
					g.drawImage( img_array[index - 1], 0, 0 );
				}
				g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
				g.drawString( "" + index + " loaded", 10, 30 );
			}
			if( img_array.length < img_src.length ){
				img_array[index] = loadImage( img_src[index] );
			} else if( !img_loaded ){
				img_loaded = true;
				if( disp_img ){
					window.setTimeout( function(){
						document.getElementById( "div0" ).style.display = "none";
						document.getElementById( "div1" ).style.display = "block";
						setCurrent3D( "canvas1" );
					}, 1000 );
				} else {
					document.getElementById( "div0" ).style.display = "none";
					document.getElementById( "div1" ).style.display = "block";
					setCurrent3D( "canvas1" );
				}
			}
		}
	} else {
		img_loaded = true;
		document.getElementById( "div0" ).style.display = "none";
		document.getElementById( "div1" ).style.display = "block";
		setCurrent3D( "canvas1" );
	}
}

var shader;

var positionBuffer;
var normalBuffer;
var colorBuffer;
var textureCoordBuffer;
var indexBuffer;

// 立方体を回転させる
var cubeRotation = 0.0;

function init3D( gl, glu ){
	if( use_texture ){
		if( use_glmodel ){
			use_glt = true;
		}
		if( use_glt || set_transparency ){
			glt = new _GLTexture( img_array, img_array.length );

			glt.use( 0, set_transparency );
		} else {
			imageData = imageDataFromImage( img_array[0] );

			textureId = gl.createTexture();
			gl.bindTexture( gl.TEXTURE_2D, textureId );
			gl.pixelStorei( gl.UNPACK_ALIGNMENT, 1 );
			gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL, false );
			var level = 0;
			var internalformat = gl.RGBA;
			var format = gl.RGBA;
			var type = gl.UNSIGNED_BYTE;
			gl.texImage2D( gl.TEXTURE_2D, level, internalformat, format, type, imageData );

			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
			gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );

			gl.activeTexture( gl.TEXTURE0 );
			gl.bindTexture( gl.TEXTURE_2D, textureId );
		}
	}

	// 頂点シェーダーのプログラム
	const vsSource = `
		attribute vec3 aVertexPosition;
		attribute vec4 aVertexColor;

		uniform mat4 uProjectionMatrix;
		uniform mat4 uModelViewMatrix;

		varying lowp vec4 vColor;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

			vColor = aVertexColor;
		}
	`;

	// 頂点シェーダーのプログラム（テクスチャ使用の場合）
	const vsSourceTexture = `
		attribute vec3 aVertexPosition;
		attribute vec2 aTextureCoord;

		uniform mat4 uProjectionMatrix;
		uniform mat4 uModelViewMatrix;

		varying highp vec2 vTextureCoord;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

			vTextureCoord = aTextureCoord;
		}
	`;

	// 頂点シェーダーのプログラム（ライティング使用の場合）
	const vsSourceLighting = `
		attribute vec3 aVertexPosition;
		attribute vec3 aVertexNormal;
		attribute vec2 aTextureCoord;

		uniform mat4 uProjectionMatrix;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uNormalMatrix;

		varying highp vec2 vTextureCoord;
		varying highp vec3 vNormal;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

			vTextureCoord = aTextureCoord;

			vNormal = vec3(uNormalMatrix * vec4(aVertexNormal, 1.0));
		}
	`;

	// フラグメントシェーダーのプログラム
	const fsSource = `
		varying lowp vec4 vColor;

		void main(void) {
			gl_FragColor = vColor;
		}
	`;

	// フラグメントシェーダーのプログラム（テクスチャ使用の場合）
	const fsSourceTexture = `
		uniform sampler2D uSampler;

		varying highp vec2 vTextureCoord;

		void main(void) {
			gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
		}
	`;

	// フラグメントシェーダーのプログラム（ライティング使用の場合）
	const fsSourceLighting = `
		precision mediump float;

		uniform vec3 uDirectionalLightColor;
		uniform vec3 uDirectionalLightPosition;

		uniform vec3 uAmbientLightColor;

		uniform sampler2D uSampler;

		varying highp vec2 vTextureCoord;
		varying highp vec3 vNormal;

		void main(void) {
			highp vec3 normal = normalize(vNormal);
			highp vec3 directionalLightPosition = normalize(uDirectionalLightPosition);
			highp float cosAngle = clamp(dot(normal, directionalLightPosition), 0.0, 1.0);	// ベクトルの内積
			highp vec3 diffuse = uDirectionalLightColor * cosAngle;

			lowp vec3 ambient = uAmbientLightColor;

			highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
			gl_FragColor = vec4(texelColor.rgb * (diffuse + ambient), texelColor.a);
		}
	`;

	// シェーダープログラムを初期化する
	// （ここで頂点へのライティングなどがすべて確立される）
	if( use_texture ){
		if( use_lighting ){
			shader = new _GLShader( vsSourceLighting, fsSourceLighting, true );
		} else {
			shader = new _GLShader( vsSourceTexture, fsSourceTexture, true );
		}
	} else {
		shader = new _GLShader( vsSource, fsSource, true );
	}

	// WebGLに、描写に使用するプログラムを伝える
	shader.use();

	if( shader.vars.uSampler != undefined ){
		gl.uniform1i( shader.vars.uSampler, 0 );
	}

	var data = [];
	if( use_texture ){
		data = data.concat( [
			1,
			0, 0, 0, 0, 0, 0,
		] );
	} else {
		data = data.concat( [
			0,
		] );
	}
	data = data.concat( [
		0, 0, 0,
		0, 0, 0, 0,
	] );

	data = data.concat( [
		1,
		24,
	] );
	const positions = [
		-1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,	// 前面
		-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0,	// 背面
		-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,	// 上面
		-1.0, -1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,	// 底面
		 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,	// 右側面
		-1.0, -1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0,	// 左側面
	];
	data = data.concat( positions );
	if( !use_glmodel ){
		positionBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( shader.vars.aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( shader.vars.aVertexPosition );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	data = data.concat( [
		1,
		24,
	] );
	const vertexNormals = [
		 0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,	// 前面
		 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,	// 背面
		 0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,	// 上面
		 0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,	// 底面
		 1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,	// 右側面
		-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,	// 左側面
	];
	data = data.concat( vertexNormals );
	if( !use_glmodel ){
		if( shader.vars.aVertexNormal != undefined ){
			normalBuffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexNormals ), gl.STATIC_DRAW );
			gl.vertexAttribPointer( shader.vars.aVertexNormal, 3, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( shader.vars.aVertexNormal );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
	}

	data = data.concat( [
		1,
		24,
	] );
	var colors;
	if( use_glmodel ){
		colors = [
			[1.0, 1.0, 1.0],	// 前面：白
			[1.0, 0.0, 0.0],	// 背面：赤
			[0.0, 1.0, 0.0],	// 上面：緑
			[0.0, 0.0, 1.0],	// 底面：青
			[1.0, 1.0, 0.0],	// 右側面：黄
			[1.0, 0.0, 1.0],	// 左側面：紫
		];
	} else {
		colors = [
			[1.0, 1.0, 1.0, 1.0],	// 前面：白
			[1.0, 0.0, 0.0, 1.0],	// 背面：赤
			[0.0, 1.0, 0.0, 1.0],	// 上面：緑
			[0.0, 0.0, 1.0, 1.0],	// 底面：青
			[1.0, 1.0, 0.0, 1.0],	// 右側面：黄
			[1.0, 0.0, 1.0, 1.0],	// 左側面：紫
		];
	}
	var generatedColors = [];
	for( var j = 0; j < 6; j++ ){
		var c = colors[j];
		for( var i = 0; i < 4; i++ ){
			generatedColors = generatedColors.concat( c );
		}
	}
	data = data.concat( generatedColors );
	if( !use_glmodel ){
		if( shader.vars.aVertexColor != undefined ){
			colorBuffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( generatedColors ), gl.STATIC_DRAW );
			gl.vertexAttribPointer( shader.vars.aVertexColor, 4, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( shader.vars.aVertexColor );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
	}

	data = data.concat( [
		1,
		24,
	] );
	var tmp = 240.0 / 256.0;
	const textureCoordinates = [
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 前面
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 背面
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 上面
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 底面
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 右側面
		0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 左側面
	];
	data = data.concat( textureCoordinates );
	if( !use_glmodel ){
		if( shader.vars.aTextureCoord != undefined ){
			textureCoordBuffer = gl.createBuffer();
			gl.bindBuffer( gl.ARRAY_BUFFER, textureCoordBuffer );
			gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordinates ), gl.STATIC_DRAW );
			gl.vertexAttribPointer( shader.vars.aTextureCoord, 2, gl.FLOAT, false, 0, 0 );
			gl.enableVertexAttribArray( shader.vars.aTextureCoord );
			gl.bindBuffer( gl.ARRAY_BUFFER, null );
		}
	}

	if( use_glmodel ){
/*
		data = data.concat( [
			6,
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 0, 1, 2, 1, 2, 3,	// 前面
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 4, 5, 6, 5, 6, 7,	// 背面
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 8, 9, 10, 9, 10, 11,	// 上面
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 12, 13, 14, 13, 14, 15,	// 底面
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 16, 17, 18, 17, 18, 19,	// 右側面
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			6, 20, 21, 22, 21, 22, 23,	// 左側面
		] );
*/
		data = data.concat( [
			1,
			0, 0, 0,
			0, 0, 0, 0,
			use_texture ? 0 : -1,
			0, 0, 0, 0,
			46,
			 0,  1,  2,  1,  2,  3,	// 前面
			 3,  4,
			 4,  5,  6,  5,  6,  7,	// 背面
			 7,  8,
			 8,  9, 10,  9, 10, 11,	// 上面
			11, 12,
			12, 13, 14, 13, 14, 15,	// 底面
			15, 16,
			16, 17, 18, 17, 18, 19,	// 右側面
			19, 20,
			20, 21, 22, 21, 22, 23,	// 左側面
		] );
	} else {
		const indices = [
			 0,  1,  2,  1,  3,  2,	// 前面
			 4,  5,  6,  5,  7,  6,	// 背面
			 8,  9, 10,  9, 11, 10,	// 上面
			12, 13, 14, 13, 15, 14,	// 底面
			16, 17, 18, 17, 19, 18,	// 右側面
			20, 21, 22, 21, 23, 22,	// 左側面
		];
		indexBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), gl.STATIC_DRAW );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	}

	if( use_glmodel ){
		model = createGLModel( data, 1.0, -1, true, false );
	}

	return true;
}

function paint3D( gl, glu ){
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );	// 黒でクリア、完全に不透明
	gl.clearDepth( 1.0 );	// 全てをクリア

	gl.enable( gl.CULL_FACE );	// 裏面を表示しない

	gl.enable( gl.DEPTH_TEST );	// 深度テストを有効化
	gl.depthFunc( gl.LEQUAL );	// 奥にあるものは隠れるようにする
	gl.depthMask( true );

//	gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
	gl.blendFuncSeparate( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE );

	// 描写を行う前にキャンバスをクリアする
	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

	// カメラで遠近感を再現するために使用される特殊な行列、パースペクティブマトリクスを作成する
	var fieldOfView = (45 * Math.PI) / 180;	// 視野角（ラジアン）
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;	// 幅と高さの比率はキャンバスの表示サイズに合わせる
	var zNear = 0.1;	// 表示するオブジェクトの範囲（手前）
	var zFar = 100.0;	// 表示するオブジェクトの範囲（奥）
	var t = Math.tan( fieldOfView / 2 ) * zNear;
	var b = -t;
	var r = t * aspect;
	var l = -r;
	glu.setIdentity();
	glu.frustum( l, r, b, t, zNear, zFar );
	gl.uniformMatrix4fv( shader.vars.uProjectionMatrix, false, glu.glMatrix() );

	glu.setIdentity();
	glu.translate( -0.0, 0.0, -6.0 );
	cubeRotation += 0.03;
	glu.rotate( cubeRotation * 180 / Math.PI, 0, 0, 1 );	// Z軸回転
	glu.rotate( (cubeRotation * 0.7) * 180 / Math.PI, 0, 1, 0 );	// Y軸回転
	glu.rotate( (cubeRotation * 0.3) * 180 / Math.PI, 1, 0, 0 );	// X軸回転
	var modelViewMatrix = glu.glMatrix();
	gl.uniformMatrix4fv( shader.vars.uModelViewMatrix, false, modelViewMatrix );

	if( shader.vars.uNormalMatrix != undefined ){
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.invert();
		glu.transpose();
		gl.uniformMatrix4fv( shader.vars.uNormalMatrix, false, glu.glMatrix() );

		gl.uniform3fv( shader.vars.uDirectionalLightColor, directionalLightColor );
		gl.uniform3fv( shader.vars.uDirectionalLightPosition, directionalLightPosition );
		gl.uniform3fv( shader.vars.uAmbientLightColor, ambientLightColor );
	}

	if( !use_glmodel && use_texture ){
		gl.enable( gl.BLEND );

		if( set_transparency ){
			gl.disable( gl.CULL_FACE );

			gl.depthMask( false );

			glt.setTransparency( 0, 0.5 );
		}
	}

	if( use_glmodel ){
		var gld = new _GLDraw( null );
		gld.add( model, -1, -1, null, set_transparency ? 0.5 : -1 );
		gld.draw( use_glt ? glt : null );
	} else {
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
		var count = gl.getBufferParameter( gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE ) / 2/*UNSIGNED_SHORT*/;
		gl.drawElements( gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0 );
		gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
	}
}

// _GLTexture用
function glTextureAlphaFlag( index ){
	return true;
}
function glTextureDepthFlag( index ){
	return true;
}
function glTextureFlipY( index ){
	return false;
}
function glTextureFilter( gl, index ){
	return gl.LINEAR;
}
function glTextureWrap( gl, index ){
	return gl.CLAMP_TO_EDGE;
}

// _GLModel用
function glModelActiveTexture( gl, id ){
	return gl.TEXTURE0;
}
function glModelBindPositionBuffer( gl, id ){
	_GLShader.bindPositionBuffer( shader.vars.aVertexPosition );
}
function glModelBindNormalBuffer( gl, id ){
	if( shader.vars.aVertexNormal != undefined ){
		_GLShader.bindNormalBuffer( shader.vars.aVertexNormal );
	}
}
function glModelBindColorBuffer( gl, id ){
	if( shader.vars.aVertexColor != undefined ){
		_GLShader.bindColorBuffer( shader.vars.aVertexColor );
	}
}
function glModelBindTextureCoordBuffer( gl, id ){
	if( shader.vars.aTextureCoord != undefined ){
		_GLShader.bindTextureCoordBuffer( shader.vars.aTextureCoord );
	}
}
function glModelSetTexture( gl, glt/*_GLTexture*/, index, tex_index ){
	return false;
}
function glModelBeginDraw( gl, glt/*_GLTexture*/, index, tex_index ){
	return true;
}
function glModelEndDraw( gl, glt/*_GLTexture*/, index, tex_index ){
}

// _GLDraw用
function glDrawUseProgram( gl, p, index ){
}
function glDrawSetProjectionMatrix( gl, mat, p, index ){
}
function glDrawSetModelViewMatrix( gl, mat, p, index ){
}

function processEvent( type, param ){
	switch( type ){
	case _KEY_PRESSED_EVENT:
		break;
	case _KEY_RELEASED_EVENT:
		break;
	case _MOUSE_DOWN_EVENT:
		break;
	case _MOUSE_MOVE_EVENT:
		break;
	case _MOUSE_UP_EVENT:
		break;
	}
}

function error(){
	launch( "error.html" );
}

function imageDataFromImage( image ){
	var canvas = document.createElement( "canvas" );
	var context = canvas.getContext( "2d" );
	canvas.width = image.width;
	canvas.height = image.height;
	context.drawImage( image, 0, 0 );
	return context.getImageData( 0, 0, canvas.width, canvas.height );
}
