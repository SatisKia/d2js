#include "model.js"

var glu;

var model_sphere;

function frameTime(){ return 1000 / 30/*フレーム*/; }

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

	setCurrent3D( "canvas1", "canvas0" );
}

var shader;

var aVertexPosition;
var aVertexColor = null;
var aVertexNormal = null;
var uProjectionMatrix;
var uModelViewMatrix;

// ライティング
var uNormalMatrix = null;

// diffuse（平行光源による拡散光）
var uDirectionalLightColor;
var uDirectionalLightPosition;

// ambient（環境光）
var uAmbientLightColor;

// specular（鏡面光）
var uEyeDirection;
var uSpecularLightColor;

// マテリアル
var uDiffuse;	// 拡散反射成分（物体の色）
var uAmbient;	// 環境反射成分
var uSpecular;	// 鏡面反射成分（きらめきの色）
var uShininess;	// 鏡面係数（きらめきの度合い）

// カメラを回転させる
var rotation = 0.0;
function rotate( glu ){
	glu.rotate( 30, 1, 0, 0 );	// X軸回転
	glu.rotate( rotation * 180 / Math.PI, 0, 1, 0 );	// Y軸回転
}

function init3D( gl, _glu ){
	glu = _glu;

	if( useProject ){
		glu.viewport( 0, 0, getWidth(), getHeight() );
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

	// 頂点シェーダーのプログラム（ライティング使用の場合）
	const vsSourceLighting = `
		attribute vec3 aVertexPosition;
		attribute vec3 aVertexNormal;
		attribute vec4 aVertexColor;

		uniform mat4 uProjectionMatrix;
		uniform mat4 uModelViewMatrix;
		uniform mat4 uNormalMatrix;

		varying lowp vec4 vColor;
		varying highp vec3 vNormal;

		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);

			vColor = aVertexColor;

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

	// フラグメントシェーダーのプログラム（ライティング使用の場合）
	const fsSourceLighting = `
		precision mediump float;

		uniform vec3 uDirectionalLightColor;
		uniform vec3 uDirectionalLightPosition;

		uniform vec3 uAmbientLightColor;

		uniform vec3 uEyeDirection;
		uniform vec3 uSpecularLightColor;

		uniform vec3 uDiffuse;
		uniform vec3 uAmbient;
		uniform vec3 uSpecular;
		uniform float uShininess;

		varying lowp vec4 vColor;
		varying highp vec3 vNormal;

		void main(void) {
			highp vec3 normal = normalize(vNormal);

			highp vec3 directionalLightPosition = normalize(uDirectionalLightPosition);
			highp float cosAngle = clamp(dot(normal, directionalLightPosition), 0.0, 1.0);	// ベクトルの内積
			highp vec3 diffuse = (uDirectionalLightColor * uDiffuse) * cosAngle;

			lowp vec3 ambient = uAmbientLightColor * uAmbient;

			highp vec3 eyeDirection = normalize(uEyeDirection);
			highp float powCosAngle = pow(clamp(dot(normal, eyeDirection), 0.0, 1.0), uShininess);	// 内積によって得られた結果をべき乗によって収束させる
			highp vec3 specular = (uSpecularLightColor * uSpecular) * powCosAngle;

			gl_FragColor = vec4(vColor.rgb * (diffuse + ambient + specular), vColor.a);
		}
	`;

	if( useLighting ){
		shader = new _GLShader( vsSourceLighting, fsSourceLighting );
	} else {
		shader = new _GLShader( vsSource, fsSource );
	}
	shader.use();

	aVertexPosition = shader.attrib( "aVertexPosition" );
	if( useLighting ){
		aVertexNormal = shader.attrib( "aVertexNormal" );
	}
	aVertexColor = shader.attrib( "aVertexColor" );

	uProjectionMatrix = shader.uniform( "uProjectionMatrix" );
	uModelViewMatrix = shader.uniform( "uModelViewMatrix" );
	if( useLighting ){
		uNormalMatrix = shader.uniform( "uNormalMatrix" );
		uAmbientLightColor = shader.uniform( "uAmbientLightColor" );
		uDirectionalLightColor = shader.uniform( "uDirectionalLightColor" );
		uDirectionalLightPosition = shader.uniform( "uDirectionalLightPosition" );
		uEyeDirection = shader.uniform( "uEyeDirection" );
		uSpecularLightColor = shader.uniform( "uSpecularLightColor" );
		uDiffuse = shader.uniform( "uDiffuse" );
		uAmbient = shader.uniform( "uAmbient" );
		uSpecular = shader.uniform( "uSpecular" );
		uShininess = shader.uniform( "uShininess" );
	}

	model_sphere = new Array( 3 );
	model_sphere[0] = createGLModel( MODEL_SPHERE, 0.015, 0, true, useLighting );
	model_sphere[1] = createGLModel( MODEL_SPHERE, 0.015, 1, true, useLighting );
	model_sphere[2] = createGLModel( MODEL_SPHERE, 0.015, 2, true, useLighting );

	return true;
}

function paint3D( gl, glu ){
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );	// 黒でクリア、完全に不透明
	gl.clearDepth( 1.0 );	// 全てをクリア

//	gl.enable( gl.CULL_FACE );	// 裏面を表示しない

	gl.enable( gl.DEPTH_TEST );	// 深度テストを有効化
	gl.depthFunc( gl.LEQUAL );	// 奥にあるものは隠れるようにする
//	gl.depthMask( true );

	gl.enable( gl.BLEND );
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
	glu.translate( 0.0, 1.0, -15.0 );
	rotation += 0.03;
	rotate( glu );
	glu.translate( 0.0, -1.0, 15.0 );
	var projectionMatrix = glu.glMatrix();	// プロジェクション座標変換行列
	gl.uniformMatrix4fv( uProjectionMatrix, false, projectionMatrix );

	if( useProject ){
		glu.setProjMatrix( glu.utMatrix( projectionMatrix ) );

		var camera_x = 0.0;
		var camera_y = 10.0;
		var camera_z = -3.0;
		var look_x = 0.0;
		var look_y = -0.5;
		var look_z = -15.0;
		glu.lookAt(camera_x, camera_y, camera_z, look_x, look_y, look_z, 0.0, 1.0, 0.0);
	} else {
		glu.setIdentity();
	}
	glu.translate( 0.0, 1.0, -15.0 );
	var modelViewMatrix = glu.glMatrix();	// モデル座標変換行列
	if( useProject ){
		glu.setModelMatrix( glu.utMatrix( modelViewMatrix ) );
	}

	if( useLighting ){
/*
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.invert();	// モデル座標変換行列の逆行列
		glu.transpose();	// 行列の転置により、法線を正しい向きに修正する
		gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		glu.pop();
*/

		gl.uniform3fv(uAmbientLightColor, ambientLightColor);
		gl.uniform3fv(uDirectionalLightColor, directionalLightColor);
		gl.uniform3fv(uDirectionalLightPosition, directionalLightPosition);
		gl.uniform3fv(uSpecularLightColor, specularLightColor);

		/*
		 * OpenGL用行列の配列データ
		 * [m0,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12,m13,m14,m15]
		 * の並びは次のようになっている
		 * | m0 m4 m8  m12 |
		 * | m1 m5 m9  m13 |
		 * | m2 m6 m10 m14 |
		 * | m3 m7 m11 m15 |
		 * 視線ベクトルは(-m2,-m6,-m10)
		 */
/*
		glu.push();
		glu.setIdentity();
		rotate( glu );
		var matrix = glu.glMatrix();
		glu.pop();
		gl.uniform3fv(uEyeDirection, [matrix[2], matrix[6], matrix[10]]);
*/
		gl.uniform3fv(uEyeDirection, [-projectionMatrix[2], -projectionMatrix[6], -projectionMatrix[10]]);
	}

var g = getGraphics();
g.setFont( 24, "ＭＳ ゴシック" );
g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	var matrix;
	var i;
	if( useGLDraw ){
		var gld = new _GLDraw( null );
		for ( i = model_sphere[0].stripNum() - 1; i >= 0; i-- ) {
			gld.add( model_sphere[0], i, -1, modelViewMatrix, -1, false );
		}
		if( useProject ){
//			glu.project( modelViewMatrix[12], modelViewMatrix[13], modelViewMatrix[14] );
			glu.project( 0.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "1:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.translate( -5.0, 0.0, 0.0 );
		matrix = glu.glMatrix();
		for ( i = model_sphere[1].stripNum() - 1; i >= 0; i-- ) {
			gld.add( model_sphere[1], i, -1, matrix, -1, false );
		}
		glu.pop();
		if( useProject ){
//			glu.project( matrix[12], matrix[13], matrix[14] );
			glu.project( -5.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "2:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.translate( 5.0, 0.0, 0.0 );
		matrix = glu.glMatrix();
		for ( i = model_sphere[2].stripNum() - 1; i >= 0; i-- ) {
			gld.add( model_sphere[2], i, -1, matrix, -1, false );
		}
		glu.pop();
		if( useProject ){
//			glu.project( matrix[12], matrix[13], matrix[14] );
			glu.project( 5.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "3:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
		gld.draw();
	} else {
		glu.set( glu.utMatrix( modelViewMatrix ) );
		gl.uniformMatrix4fv( uModelViewMatrix, false, glu.glMatrix() );
		if( useLighting ){
			glu.invert();	// モデル座標変換行列の逆行列
			glu.transpose();	// 行列の転置により、法線を正しい向きに修正する
			gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		}
		for ( i = model_sphere[0].stripNum() - 1; i >= 0; i-- ) {
			model_sphere[0].draw( null, i, -1, false );
		}
		if( useProject ){
//			glu.project( modelViewMatrix[12], modelViewMatrix[13], modelViewMatrix[14] );
			glu.project( 0.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "1:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.translate( -5.0, 0.0, 0.0 );
		matrix = glu.glMatrix();
		gl.uniformMatrix4fv( uModelViewMatrix, false, matrix );
		if( useLighting ){
			glu.invert();	// モデル座標変換行列の逆行列
			glu.transpose();	// 行列の転置により、法線を正しい向きに修正する
			gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		}
		for ( i = model_sphere[1].stripNum() - 1; i >= 0; i-- ) {
			model_sphere[1].draw( null, i, -1, false );
		}
		glu.pop();
		if( useProject ){
//			glu.project( matrix[12], matrix[13], matrix[14] );
			glu.project( -5.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "2:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.translate( 5.0, 0.0, 0.0 );
		matrix = glu.glMatrix();
		gl.uniformMatrix4fv( uModelViewMatrix, false, matrix );
		if( useLighting ){
			glu.invert();	// モデル座標変換行列の逆行列
			glu.transpose();	// 行列の転置により、法線を正しい向きに修正する
			gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		}
		for ( i = model_sphere[2].stripNum() - 1; i >= 0; i-- ) {
			model_sphere[2].draw( null, i, -1, false );
		}
		glu.pop();
		if( useProject ){
//			glu.project( matrix[12], matrix[13], matrix[14] );
			glu.project( 5.0, 0.0, 0.0 );
			var projectX = glu.projectX();
			var projectY = glu.projectY();
			var projectZ = glu.projectZ();
			glu.unProject( projectX, projectY, projectZ );
g.drawString( "3:" + (_INT(glu.projectX() * 10) / 10) + "," + (_INT(glu.projectY() * 10) / 10) + "," + (_INT(glu.projectZ() * 10) / 10), projectX, getHeight() - projectY );
		}
	}
}

function init2D( g ){
}

function clear2D( g ){
	g.setColor( g.getColorOfRGBA( 0, 0, 0, 0 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );
}

function paint2D( g ){
	g.setFont( 24, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "rotation " + _MOD(_INT(rotation * 180 / Math.PI), 360), 10, 30 );
}

// _GLModel用
function glModelActiveTexture( gl, id ){
	return gl.TEXTURE0;
}
function glModelBindPositionBuffer( gl ){
	gl.vertexAttribPointer( aVertexPosition, 3, gl.FLOAT, false, 0, 0 );
	gl.enableVertexAttribArray( aVertexPosition );
}
function glModelBindNormalBuffer( gl ){
	if( aVertexNormal != null ){
		gl.vertexAttribPointer( aVertexNormal, 3, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aVertexNormal );
	}
}
function glModelBindColorBuffer( gl ){
	if( aVertexColor != null ){
		gl.vertexAttribPointer( aVertexColor, 4, gl.FLOAT, false, 0, 0 );
		gl.enableVertexAttribArray( aVertexColor );
	}
}
function glModelBindTextureCoordBuffer( gl ){
}
function glModelSetTexture( gl, glt/*_GLTexture*/, index, tex_index ){
	return false;
}
function glModelBeginDraw( gl, glt/*_GLTexture*/, index, tex_index, id, lighting, material_diffuse, material_ambient, material_emission, material_specular, material_shininess ){
	if( lighting ){
		gl.uniform3fv(uDiffuse, diffuse[id]);
		gl.uniform3fv(uAmbient, ambient[id]);
		gl.uniform3fv(uSpecular, specular[id]);
		gl.uniform1f(uShininess, shininess[id]);
	} else {
	}
	if( material_diffuse != null ){
	}
	if( material_ambient != null ){
	}
	if( material_emission != null ){
	}
	if( material_specular != null ){
	}
	if( material_shininess != null ){
	}
	return true;
}
function glModelEndDraw( gl, glt/*_GLTexture*/, index, tex_index ){
}

// _GLDraw用
function glDrawUseProgram( gl, p, index ){
}
function glDrawSetProjectionMatrix( gl, mat, p, index ){
}
function glDrawSetModelViewMatrix( gl, mat ){
	if( useLighting ){
		glu.push();
		glu.set( glu.utMatrix( mat ) );
		glu.invert();	// モデル座標変換行列の逆行列
		glu.transpose();	// 行列の転置により、法線を正しい向きに修正する
		gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		glu.pop();
	}
	gl.uniformMatrix4fv( uModelViewMatrix, false, mat );
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
