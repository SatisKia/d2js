#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"
#include "_Math.js"

//#include "gl\_GLDraw.js"
#include "gl\_GLMain.js"
//#include "gl\_GLModel.js"
//#include "gl\_GLPrimitive.js"
//#include "gl\_GLSprite.js"
#include "gl\_GLTexture.js"
//#include "gl\_GLTriangle.js"
#include "gl\_GLUtility.js"

var glt;

var img_loaded = false;
var img_array = new Array();
var img_src = [
#include "data.txt"
];

var imageData;
var textureId;

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

var shaderProgram;
var aVertexPosition;
var aVertexColor = null;
var aVertexNormal = null;
var aTextureCoord = null;
var uProjectionMatrix;
var uModelViewMatrix;
var uNormalMatrix = null;
var uAmbientLightColor;
var uDirectionalLightColor;
var uDirectionalLightPosition;
var uSampler = null;

var positionBuffer;
var colorBuffer;
var normalBuffer;
var textureCoordBuffer;
var indexBuffer;

// 立方体を回転させる
var cubeRotation = 0.0;

function init3D( gl, glu ){
	if( use_texture ){
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
		uniform vec3 uAmbientLightColor;
		uniform vec3 uDirectionalLightColor;
		uniform vec3 uDirectionalLightPosition;

		varying highp vec2 vTextureCoord;
		varying lowp vec3 vAmbient;
		varying highp vec3 vDiffuse;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

			vTextureCoord = aTextureCoord;

			vAmbient = uAmbientLightColor;

			highp vec3 directionalLightPosition = normalize(uDirectionalLightPosition);
			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			highp float diffuse = clamp(dot(transformedNormal.xyz, directionalLightPosition), 0.0, 1.0);	// ベクトルの内積
			vDiffuse = uDirectionalLightColor * diffuse;
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
		uniform sampler2D uSampler;
		varying highp vec2 vTextureCoord;
		varying lowp vec3 vAmbient;
		varying highp vec3 vDiffuse;
		void main(void) {
			highp vec4 texelColor = texture2D(uSampler, vec2(vTextureCoord.s, vTextureCoord.t));
			gl_FragColor = vec4(texelColor.rgb * (vAmbient + vDiffuse), texelColor.a);
		}
	`;

	// シェーダープログラムを初期化する
	// （ここで頂点へのライティングなどがすべて確立される）
	if( use_texture ){
		if( use_lighting ){
			shaderProgram = createShaderProgram( vsSourceLighting, fsSourceLighting );
		} else {
			shaderProgram = createShaderProgram( vsSourceTexture, fsSourceTexture );
		}

		aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
		if( use_lighting ){
			aVertexNormal = gl.getAttribLocation( shaderProgram, "aVertexNormal" );
		}
		aTextureCoord = gl.getAttribLocation( shaderProgram, "aTextureCoord" );

		uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
		uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
		if( use_lighting ){
			uNormalMatrix = gl.getUniformLocation( shaderProgram, "uNormalMatrix" );
			uAmbientLightColor = gl.getUniformLocation( shaderProgram, "uAmbientLightColor" );
			uDirectionalLightColor = gl.getUniformLocation( shaderProgram, "uDirectionalLightColor" );
			uDirectionalLightPosition = gl.getUniformLocation( shaderProgram, "uDirectionalLightPosition" );
		}

		uSampler = gl.getUniformLocation( shaderProgram, "uSampler" );
	} else {
		shaderProgram = createShaderProgram( vsSource, fsSource );

		aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
		aVertexColor = gl.getAttribLocation( shaderProgram, "aVertexColor" );

		uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
		uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
	}

	// WebGLに、描写に使用するプログラムを伝える
	gl.useProgram( shaderProgram );

	if( uSampler != null ){
		gl.uniform1i( uSampler, 0 );
	}

	const positions = [
		-1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,  1.0,	// 前面
		-1.0, -1.0, -1.0, -1.0,  1.0, -1.0,  1.0, -1.0, -1.0,  1.0,  1.0, -1.0,	// 背面
		-1.0,  1.0, -1.0, -1.0,  1.0,  1.0,  1.0,  1.0, -1.0,  1.0,  1.0,  1.0,	// 上面
		-1.0, -1.0, -1.0,  1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0,	// 底面
		 1.0, -1.0, -1.0,  1.0,  1.0, -1.0,  1.0, -1.0,  1.0,  1.0,  1.0,  1.0,	// 右側面
		-1.0, -1.0, -1.0, -1.0, -1.0,  1.0,  -1.0,  1.0, -1.0,-1.0,  1.0,  1.0,	// 左側面
	];
	positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
	gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( aVertexPosition );
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	if( aVertexColor != null ){
		const colors = [
			[1.0, 1.0, 1.0, 1.0],	// 前面：白
			[1.0, 0.0, 0.0, 1.0],	// 背面：赤
			[0.0, 1.0, 0.0, 1.0],	// 上面：緑
			[0.0, 0.0, 1.0, 1.0],	// 底面：青
			[1.0, 1.0, 0.0, 1.0],	// 右側面：黄
			[1.0, 0.0, 1.0, 1.0],	// 左側面：紫
		];
		var generatedColors = [];
		for( var j = 0; j < 6; j++ ){
			var c = colors[j];
			for( var i = 0; i < 4; i++ ){
				generatedColors = generatedColors.concat( c );
			}
		}
		colorBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( generatedColors ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( aVertexColor, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aVertexColor );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	if( aVertexNormal != null ){
		const vertexNormals = [
			 0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,	// 前面
			 0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,	// 背面
			 0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,	// 上面
			 0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,	// 底面
			 1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,  1.0,  0.0,  0.0,	// 右側面
			-1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0, -1.0,  0.0,  0.0,	// 左側面
		];
		normalBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertexNormals ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( aVertexNormal, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aVertexNormal );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	if( aTextureCoord != null ){
		var tmp = 240.0 / 256.0;
		const textureCoordinates = [
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 前面
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 背面
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 上面
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 底面
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 右側面
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,	// 左側面
		];
		textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, textureCoordBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordinates ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( aTextureCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aTextureCoord );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

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
	glu.setIdentity();
	var t = Math.tan( fieldOfView / 2 ) * zNear;
	var b = -t;
	var r = t * aspect;
	var l = -r;
	glu.frustum( l, r, b, t, zNear, zFar );
	gl.uniformMatrix4fv( uProjectionMatrix, false, glu.glMatrix() );

	glu.setIdentity();
	glu.translate( -0.0, 0.0, -6.0 );
	cubeRotation += 0.03;
	glu.rotate( cubeRotation * 180 / Math.PI, 0, 0, 1 );	// Z軸回転
	glu.rotate( (cubeRotation * 0.7) * 180 / Math.PI, 0, 1, 0 );	// Y軸回転
	glu.rotate( (cubeRotation * 0.3) * 180 / Math.PI, 1, 0, 0 );	// X軸回転
	var modelViewMatrix = glu.glMatrix();
	gl.uniformMatrix4fv( uModelViewMatrix, false, modelViewMatrix );

	if( uNormalMatrix != null ){
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.invert();
		glu.transpose();
		gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );

		gl.uniform3fv(uAmbientLightColor, ambientLightColor);
		gl.uniform3fv(uDirectionalLightColor, directionalLightColor);
		gl.uniform3fv(uDirectionalLightPosition, directionalLightPosition);
	}

	if( use_texture ){
		gl.enable( gl.BLEND );

		if( set_transparency ){
			gl.disable( gl.CULL_FACE );

			gl.depthMask( false );

			glt.setTransparency( 0, 0.5 );
		}
	}

	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, indexBuffer );
	var count = gl.getBufferParameter( gl.ELEMENT_ARRAY_BUFFER, gl.BUFFER_SIZE ) / 2/*UNSIGNED_SHORT*/;
	gl.drawElements( gl.TRIANGLES, count, gl.UNSIGNED_SHORT, 0 );
	gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, null );
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
