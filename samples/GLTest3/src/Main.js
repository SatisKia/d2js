#include "_Graphics.js"
//#include "_Image.js"
#include "_Main.js"

#include "gl\_GLDraw.js"
#include "gl\_GLMain.js"
#include "gl\_GLModel.js"
#include "gl\_GLPrimitive.js"
#include "gl\_GLSprite.js"
//#include "gl\_GLTexture.js"
//#include "gl\_GLTriangle.js"
#include "gl\_GLUtility.js"

#include "model.js"

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

	document.getElementById( "div0" ).style.display = "none";
	document.getElementById( "div1" ).style.display = "block";
	setCurrent3D( "canvas1" );
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
var aVertexNormal = null;
var uProjectionMatrix;
var uModelViewMatrix;
var uNormalMatrix = null;
var uAmbientLightColor;
var uDirectionalLightColor;
var uDirectionalLightPosition;
var uEyeDirection;
var uSpecularLightColor;
var uShininess;

// カメラを回転させる
var rotation = 0.0;
function rotate( glu ){
	glu.rotate( 30, 1, 0, 0 );	// X軸回転
	glu.rotate( rotation * 180 / Math.PI, 0, 1, 0 );	// Y軸回転
}

function init3D( gl, glu ){
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
		uniform vec3 uAmbientLightColor;
		uniform vec3 uDirectionalLightColor;
		uniform vec3 uDirectionalLightPosition;
		uniform vec3 uEyeDirection;
		uniform vec3 uSpecularLightColor;
		uniform float uShininess;
		varying lowp vec4 vColor;
		varying lowp vec3 vAmbient;
		varying highp vec3 vDiffuse;
		varying highp vec3 vSpecular;
		void main(void) {
			gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
			vColor = aVertexColor;
			vAmbient = uAmbientLightColor;
			highp vec3 directionalLightPosition = normalize(uDirectionalLightPosition);
			highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);
			highp float diffuse = clamp(dot(transformedNormal.xyz, directionalLightPosition), 0.0, 1.0);
			highp vec3 eyeDirection = normalize(uEyeDirection);
			highp float specular = pow(clamp(dot(aVertexNormal, eyeDirection), 0.0, 1.0), uShininess);
			vDiffuse = uDirectionalLightColor * diffuse;
			vSpecular = uSpecularLightColor * specular;
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
		varying lowp vec4 vColor;
		varying lowp vec3 vAmbient;
		varying highp vec3 vDiffuse;
		varying highp vec3 vSpecular;
		void main(void) {
			gl_FragColor = vec4(vColor.rgb * (vAmbient + vDiffuse + vSpecular), vColor.a);
		}
	`;

	if( use_lighting ){
		shaderProgram = createShaderProgram( gl, vsSourceLighting, fsSourceLighting );
	} else {
		shaderProgram = createShaderProgram( gl, vsSource, fsSource );
	}
	gl.useProgram( shaderProgram );

	aVertexPosition = gl.getAttribLocation( shaderProgram, "aVertexPosition" );
	if( use_lighting ){
		aVertexNormal = gl.getAttribLocation( shaderProgram, "aVertexNormal" );
	}
	aVertexColor = gl.getAttribLocation( shaderProgram, "aVertexColor" );

	uProjectionMatrix = gl.getUniformLocation( shaderProgram, "uProjectionMatrix" );
	uModelViewMatrix = gl.getUniformLocation( shaderProgram, "uModelViewMatrix" );
	if( use_lighting ){
		uNormalMatrix = gl.getUniformLocation( shaderProgram, "uNormalMatrix" );
		uAmbientLightColor = gl.getUniformLocation( shaderProgram, "uAmbientLightColor" );
		uDirectionalLightColor = gl.getUniformLocation( shaderProgram, "uDirectionalLightColor" );
		uDirectionalLightPosition = gl.getUniformLocation( shaderProgram, "uDirectionalLightPosition" );
		uEyeDirection = gl.getUniformLocation( shaderProgram, "uEyeDirection" );
		uSpecularLightColor = gl.getUniformLocation( shaderProgram, "uSpecularLightColor" );
		uShininess = gl.getUniformLocation( shaderProgram, "uShininess" );
	}

	model_sphere = new Array( 3 );
	model_sphere[0] = createModel( glu, MODEL_SPHERE, 0.015, 0, true );
	model_sphere[1] = createModel( glu, MODEL_SPHERE, 0.015, 1, true );
	model_sphere[2] = createModel( glu, MODEL_SPHERE, 0.015, 2, true );
}

function paint3D( gl, glu ){
	gl.clearColor( 0.0, 0.0, 0.0, 1.0 );	// 黒でクリア、完全に不透明
	gl.clearDepth( 1.0 );	// 全てをクリア

	gl.enable( gl.DEPTH_TEST );	// 深度テストを有効化
	gl.depthFunc( gl.LEQUAL );	// 奥にあるものは隠れるようにする

//	gl.enable( gl.CULL_FACE );	// 裏面を表示しない
//	gl.depthMask( true );

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
	var projectionMatrix = glu.glMatrix();
	gl.uniformMatrix4fv( uProjectionMatrix, false, projectionMatrix );

	glu.setIdentity();
	glu.translate( 0.0, 1.0, -15.0 );
	var modelViewMatrix = glu.glMatrix();
	gl.uniformMatrix4fv( uModelViewMatrix, false, modelViewMatrix );

	if( use_lighting ){
		glu.push();
		glu.set( glu.utMatrix( modelViewMatrix ) );
		glu.invert();
		glu.transpose();
		gl.uniformMatrix4fv( uNormalMatrix, false, glu.glMatrix() );
		glu.pop();

		gl.uniform3fv(uAmbientLightColor, ambientLightColor);
		gl.uniform3fv(uDirectionalLightColor, directionalLightColor);
		gl.uniform3fv(uDirectionalLightPosition, directionalLightPosition);

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

	var i;
	var gld = new _GLDraw( null, null );
	for ( i = model_sphere[0].stripNum() - 1; i >= 0; i-- ) {
		gld.add( model_sphere[0], i, -1, modelViewMatrix, -1 );
	}
	glu.push();
	glu.set( glu.utMatrix( modelViewMatrix ) );
	glu.translate( -5.0, 0.0, 0.0 );
	for ( i = model_sphere[1].stripNum() - 1; i >= 0; i-- ) {
		gld.add( model_sphere[1], i, -1, glu.glMatrix(), -1 );
	}
	glu.pop();
	glu.push();
	glu.set( glu.utMatrix( modelViewMatrix ) );
	glu.translate( 5.0, 0.0, 0.0 );
	for ( i = model_sphere[2].stripNum() - 1; i >= 0; i-- ) {
		gld.add( model_sphere[2], i, -1, glu.glMatrix(), -1 );
	}
	glu.pop();
	gld.draw( gl );
}

// _GLModel用
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
		gl.uniform3fv(uSpecularLightColor, specularLightColor[id]);
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
function glDrawSetLookMatrix( gl, mat, p, index ){
}
function glDrawSetModelViewMatrix( gl, mat ){
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

function createModel( glu, data, scale, id, depth ){
	var model = new _GLModel( id, depth, use_lighting );

	var cur = 0;
	var i, j, k;
	var coord_count;
	var normal_count;
	var color_count;
	var map_count;

	// テクスチャ
	var texture_num = data[cur++];
//if ( texture_num > 0 ) {
	var texture_index = new Array(texture_num);
	var material_dif = new Array(texture_num * 4);
	var material_amb = new Array(texture_num * 4);
	var material_emi = new Array(texture_num * 4);
	var material_spc = new Array(texture_num * 4);
	var material_power = new Array(texture_num);
	for ( i = 0; i < texture_num; i++ ) {
		texture_index[i] = data[cur++];
		material_dif[i * 4] = data[cur++];
		material_dif[i * 4 + 1] = material_dif[i * 4];
		material_dif[i * 4 + 2] = material_dif[i * 4];
		material_dif[i * 4 + 3] = 1.0;
		material_amb[i * 4] = data[cur++];
		material_amb[i * 4 + 1] = material_amb[i * 4];
		material_amb[i * 4 + 2] = material_amb[i * 4];
		material_amb[i * 4 + 3] = 1.0;
		material_emi[i * 4] = data[cur++];
		material_emi[i * 4 + 1] = material_emi[i * 4];
		material_emi[i * 4 + 2] = material_emi[i * 4];
		material_emi[i * 4 + 3] = 1.0;
		material_spc[i * 4] = data[cur++];
		material_spc[i * 4 + 1] = material_spc[i * 4];
		material_spc[i * 4 + 2] = material_spc[i * 4];
		material_spc[i * 4 + 3] = 1.0;
		material_power[i] = data[cur++] * 128.0 / 100.0;
	}
//	model.setMaterial(texture_num, texture_index, material_dif, material_amb, material_emi, material_spc, material_power);
	model.setMaterial(texture_num, texture_index, null, null, null, null, null);
//}

	// グループ
	var group_tx = data[cur++] * scale;
	var group_ty = data[cur++] * scale;
	var group_tz = data[cur++] * scale;
	var group_or = data[cur++];
	var group_ox = data[cur++];
	var group_oy = data[cur++];
	var group_oz = data[cur++];
	glu.setIdentity();
	glu.translate(group_tx, group_ty, group_tz);
	glu.rotate(group_ox, group_oy, group_oz, group_or);

	var x, y, z;

	// coord
	var coord_num = data[cur++];
	coord_count = null;
	var coord = null;
	if ( coord_num > 0 ) {
		coord_count = new Array(coord_num);
		coord = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			coord_count[j] = data[cur++];
			if ( coord_count[j] <= 0 ) {
				coord[j] = null;
			} else {
				coord[j] = new Array(coord_count[j] * 3);
				for ( i = 0; i < coord_count[j]; i++ ) {
					x = data[cur++] * scale;
					y = data[cur++] * scale;
					z = data[cur++] * scale;
					glu.transVector(x, y, z);
					coord[j][i * 3    ] = glu.transX();
					coord[j][i * 3 + 1] = glu.transY();
					coord[j][i * 3 + 2] = glu.transZ();
				}
			}
		}
	}

	// normal
	var num = data[cur++];
	normal_count = null;
	var normal = null;
	if ( num > 0 ) {
		normal_count = new Array(coord_num);
		normal = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			normal_count[j] = data[cur++];
			if ( normal_count[j] <= 0 ) {
				normal[j] = null;
			} else {
				normal[j] = new Array(normal_count[j] * 3);
				for ( i = 0; i < normal_count[j]; i++ ) {
					x = data[cur++];
					y = data[cur++];
					z = data[cur++];
					glu.transVector(x, y, z);
					normal[j][i * 3    ] = glu.transX();
					normal[j][i * 3 + 1] = glu.transY();
					normal[j][i * 3 + 2] = glu.transZ();
				}
			}
		}
	}

	// color
	num = data[cur++];
	color_count = null;
	var color = null;
	if ( num > 0 ) {
		color_count = new Array(coord_num);
		color = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			color_count[j] = data[cur++];
			if ( color_count[j] <= 0 ) {
				color[j] = null;
			} else {
				color[j] = new Array(color_count[j] * 4);
				for ( i = 0; i < color_count[j]; i++ ) {
					color[j][i * 4    ] = data[cur++];
					color[j][i * 4 + 1] = data[cur++];
					color[j][i * 4 + 2] = data[cur++];
					color[j][i * 4 + 3] = 1.0;
				}
			}
		}
	}

	// map
	num = data[cur++];
	map_count = null;
	var map = null;
	if ( num > 0 ) {
		map_count = new Array(coord_num);
		map = new Array(coord_num);
		for ( j = 0; j < coord_num; j++ ) {
			map_count[j] = data[cur++];
			if ( map_count[j] <= 0 ) {
				map[j] = null;
			} else {
				map[j] = new Array(map_count[j] * 2);
				for ( i = 0; i < map_count[j]; i++ ) {
					map[j][i * 2    ] = data[cur++];
					map[j][i * 2 + 1] = data[cur++];
				}
			}
		}
	}

	model.setObject(coord_num, coord, normal, color, map);

	// 三角形ストリップ
	var strip_num = data[cur++];
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
		strip_tx[j] = data[cur++] * scale;
		strip_ty[j] = data[cur++] * scale;
		strip_tz[j] = data[cur++] * scale;
		strip_or[j] = data[cur++];
		strip_ox[j] = data[cur++];
		strip_oy[j] = data[cur++];
		strip_oz[j] = data[cur++];
		strip_texture[j] = data[cur++];
		strip_coord[j] = data[cur++];
		strip_normal[j] = data[cur++];
		strip_color[j] = data[cur++];
		strip_map[j] = data[cur++];
		strip_len[j] = data[cur++];
		strip[j] = new Array(strip_len[j]);
		for ( k = 0; k < strip_len[j]; k++ ) {
			strip[j][k] = data[cur++];
		}
	}
	model.setStrip(strip_num, strip_texture, strip_coord, strip_normal, strip_color, strip_map, strip_len, strip);

	return model;
}
