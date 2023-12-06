#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"

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

// シェーダープログラムの作成
function _loadShader( gl, type, source ){
	var shader = gl.createShader( type );

	// シェーダーオブジェクトにソースを送信
	gl.shaderSource( shader, source );

	// シェーダープログラムをコンパイル
	gl.compileShader( shader );

	// コンパイルが成功したか確認する
	if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
		gl.deleteShader( shader );
		return null;
	}

	return shader;
}
function createShaderProgram( gl, vsSource, fsSource ){
	var vertexShader = _loadShader( gl, gl.VERTEX_SHADER, vsSource );
	var fragmentShader = _loadShader( gl, gl.FRAGMENT_SHADER, fsSource );

	// シェーダープログラムの作成
	var shaderProgram = gl.createProgram();
	gl.attachShader( shaderProgram, vertexShader );
	gl.attachShader( shaderProgram, fragmentShader );
	gl.linkProgram( shaderProgram );

	// シェーダープログラムの作成に失敗した場合、アラートを出す
	if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ){
		return null;
	}

	return shaderProgram;
}

var shaderProgram;
var aVertexPosition;
var aVertexColor = null;
var aTextureCoord = null;
var uProjectionMatrix;
var uModelViewMatrix;
var uSampler;

var positionBuffer;
var colorBuffer;
var textureCoordBuffer;

// 正方形を回転させる
var squareRotation = 0.0;

function init3D( gl, glu ){
	if( use_texture ){
		glt = new _GLTexture( gl, glu, img_array, img_array.length );

		glt.use( 0, set_transparency );
	}

	// 頂点シェーダーのプログラム
	const vsSource = `
		attribute vec4 aVertexPosition;
		attribute vec4 aVertexColor;
		uniform mat4 uProjectionMatrix;
		uniform mat4 uModelViewMatrix;
		varying lowp vec4 vColor;
		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
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

	// シェーダープログラムを初期化する
	// （ここで頂点へのライティングなどがすべて確立される）
	if( use_texture ){
		shaderProgram = createShaderProgram( gl, vsSourceTexture, fsSourceTexture );

		aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
		aTextureCoord = gl.getAttribLocation( shaderProgram, "aTextureCoord" );

		uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
		uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );

		uSampler = gl.getUniformLocation( shaderProgram, "uSampler" );
		gl.uniform1i( uSampler, 0 );
	} else {
		shaderProgram = createShaderProgram( gl, vsSource, fsSource );

		aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
		aVertexColor = gl.getAttribLocation( shaderProgram, "aVertexColor" );

		uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
		uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
	}

	// WebGLに、描写に使用するプログラムを伝える
	gl.useProgram( shaderProgram );

	const positions = [
		-1.0, -1.0, 0.0,	// 左下
		 1.0, -1.0, 0.0,	// 右下
		-1.0,  1.0, 0.0,	// 左上
		 1.0,  1.0, 0.0,	// 右上
	];
	positionBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( positions ), gl.STATIC_DRAW );
	gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( aVertexPosition );
	gl.bindBuffer( gl.ARRAY_BUFFER, null );

	if( aVertexColor != null ){
		const colors = [
			0.0, 0.0, 1.0, 1.0,	// 左下：青
			0.0, 1.0, 0.0, 1.0,	// 右下：緑
			1.0, 0.0, 0.0, 1.0,	// 左上：赤
			1.0, 1.0, 1.0, 1.0,	// 右上：白
		];
		colorBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, colorBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( colors ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( aVertexColor, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aVertexColor );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}

	if( aTextureCoord != null ){
		var tmp = 240.0 / 256.0;
		const textureCoordinates = [
			0.0, tmp, tmp, tmp, 0.0, 0.0, tmp, 0.0,
		];
		textureCoordBuffer = gl.createBuffer();
		gl.bindBuffer( gl.ARRAY_BUFFER, textureCoordBuffer );
		gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( textureCoordinates ), gl.STATIC_DRAW );
		gl.vertexAttribPointer( aTextureCoord, 2, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aTextureCoord );
		gl.bindBuffer( gl.ARRAY_BUFFER, null );
	}
}

function paint3D( gl, glu ){
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );	// 黒でクリア、完全に不透明
	gl.clearDepth( 1.0 );	// 全てをクリア

	gl.enable( gl.DEPTH_TEST );	// 深度テストを有効化
	gl.depthFunc( gl.LEQUAL );	// 奥にあるものは隠れるようにする

	gl.enable( gl.CULL_FACE );	// 裏面を表示しない
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
	squareRotation += 1.5;
	glu.rotate( squareRotation, 0, 0, 1 );
	gl.uniformMatrix4fv( uModelViewMatrix, false, glu.glMatrix() );

	if( use_texture ){
		gl.enable( gl.BLEND );

		if( set_transparency ){
			gl.disable( gl.CULL_FACE );
			gl.depthMask( false );

			glt.setTransparency( 0, 127 );
		}
	}

	gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
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
