#include "_Audio.js"
#include "_Image.js"
#include "_Main.js"
#include "_Math.js"
#include "_Random.js"
#include "_ScalableGraphics.js"
#include "_Vector.js"

#include "Main.h"

#include "Enemy.js"
#include "MyStage.js"
#include "Ring.js"
#include "Shot.js"
#include "StageData0.js"
#include "StageData1.js"
#include "StageData2.js"
#include "StageData3.js"
#include "StageData4.js"
#include "StageData5.js"

#include "image_id.js"

var g;

var rand;

var _win_x, _win_y;			// ウィンドウ左上座標

var wave_data;				// ウェーブ情報
#ifdef USE_WAVEDRAWDATA
var draw_data;				// 描画時の作業用
#endif // USE_WAVEDRAWDATA
var ring;					// リング情報

var shot;					// 弾情報

var jiki_x, jiki_y;			// 位置
var dsp_x, dsp_y;			// 描画位置
var _light_x, _light_y;		// 照明の位置
var pattern_x, pattern_y;
var _mode;
var _direction;
var _barrier;
var _damage, t_damage, m_damage;
var _life;
var _muteki;
var _img;

// よく使う色
var COLOR_C;
var COLOR_M;
var COLOR_Y;
var COLOR_K;
var COLOR_R;
var COLOR_G;
var COLOR_W;

// フォント
var _FONT_FAMILY	= "ＭＳ ゴシック";
var _FONT_TINY		= 12;
var _FONT_SMALL		= 16;
var _FONT_MEDIUM	= 24;
var _FONT_LARGE		= 30;

// 三角関数テーブル
var COS = [ 1358, 1176, 679, 0, -678, -1176, -1358, -1176, -679, 0, 679, 1176 ];
var SIN = [ 0, 678, 1176, 1358, 1176, 678, 0, -679, -1176, -1358, -1176, -679 ];

var state = STATE_LAUNCH;	// アプリの状態
var _elapse;				// 経過時間
var boost = false;			// ブースト中かどうか
var map = true;				// マップを表示するかどうか
var quake = 0;				// 振動の残り時間
var quake_x, quake_y;		// 振動の移動量

var origin_x, origin_y;

var clip_x, clip_y;
var clip_w, clip_h;

var st_index;				// ステージ番号
var st_max;					// 選択可能なステージの最大
var level;					// レベル
var level_max;				// レベルの最大

var score = 0, hi_score;	// スコア
var bonus = 0;				// ボーナス

var old_score;				// ステージ開始時のスコア
var bonus_d;				// ボーナス表示用
var best_s;					// ベストスコア
var new_s;					// 今回のスコア
var new_score;				// スコア更新かどうか

var old_life;				// ステージ開始時の自機のライフ
var miss;					// ステージ中に受けたダメージ数
var best_t;					// ベストタイム
var new_t;					// 今回のタイム
var new_record;				// 記録更新かどうか

var dark;					// 闇ステージかどうか

var main_img;
var main_se;

var sound_id = -1;
var lock_sound = 0;
function play_sound( id ){
	if( main_se[id] != null ){
		if( canUseAudio() ){
			if( id != sound_id ){
				sound_id = id;
				playAudio( main_se[sound_id], false );
			}
		} else if( _USE_AUDIOEX ){
			if( id == SE_LASER ){
				if( lock_sound <= 0 ){
					sound_id = id;
					playAudio( main_se[sound_id], false );
					lock_sound = WAIT_Q;
				}
			} else {
				if( id != sound_id ){
					sound_id = id;
					playAudio( main_se[sound_id], false );
				}
			}
		}
	}
}

/**
 * 設定の読み込み
 */
function load_config(){
	var i;

	// デフォルト値
	st_index  = 0;
	hi_score  = 68000;
	st_max[0] = 0;
	st_max[1] = 0;
	st_max[2] = 0;
	st_max[3] = 0;
	st_max[4] = 0;
	st_max[5] = 0;
	st_max[6] = 0;
	st_max[7] = 0;
	level     = 0;
	level_max = 0;
	for( i = 0; i < STAGE_NUM; i++ ){
		best_s[0][i] = 0;
		best_s[1][i] = 0;
		best_s[2][i] = 0;
		best_s[3][i] = 0;
		best_s[4][i] = 0;
		best_s[5][i] = 0;
		best_s[6][i] = 0;
		best_s[7][i] = 0;
		best_t[0][i] = 99999;
		best_t[1][i] = 99999;
		best_t[2][i] = 99999;
		best_t[3][i] = 99999;
		best_t[4][i] = 99999;
		best_t[5][i] = 99999;
		best_t[6][i] = 99999;
		best_t[7][i] = 99999;
	}

	if( canUseCookie() ){
		var str;
		beginCookieRead( "config" );
		str = cookieRead(); if( str.length > 0 ) st_index  = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) hi_score  = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) st_max[0] = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) level     = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) level_max = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) st_max[1] = parseInt( str );
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[0][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[1][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[0][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[1][i] = parseInt( str );
		}
		str = cookieRead(); if( str.length > 0 ) st_max[2] = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) st_max[3] = parseInt( str );
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[2][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[3][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[2][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[3][i] = parseInt( str );
		}
		str = cookieRead(); if( str.length > 0 ) st_max[4] = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) st_max[5] = parseInt( str );
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[4][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[5][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[4][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[5][i] = parseInt( str );
		}
		str = cookieRead(); if( str.length > 0 ) st_max[6] = parseInt( str );
		str = cookieRead(); if( str.length > 0 ) st_max[7] = parseInt( str );
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[6][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_s[7][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[6][i] = parseInt( str );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			str = cookieRead(); if( str.length > 0 ) best_t[7][i] = parseInt( str );
		}
		endCookieRead();
	}

	// レベル最大値を設定する
	if( best_s[0][STAGE_NUM - 1] != 0 ) level_max = 1;
	if( best_s[1][STAGE_NUM - 1] != 0 ) level_max = 2;
	if( best_s[2][STAGE_NUM - 1] != 0 ) level_max = 3;
	if( best_s[3][STAGE_NUM - 1] != 0 ) level_max = 4;
	if( best_s[4][STAGE_NUM - 1] != 0 ) level_max = 5;
	if( best_s[5][STAGE_NUM - 1] != 0 ) level_max = 6;
	if( best_s[6][STAGE_NUM - 1] != 0 ) level_max = 7;
}

/**
 * 設定の書き出し
 */
function save_config(){
	if( canUseCookie() ){
		var i;
		beginCookieWrite();
		cookieWrite( "" + st_index );
		cookieWrite( "" + hi_score );
		cookieWrite( "" + st_max[0] );
		cookieWrite( "" + level );
		cookieWrite( "" + level_max );
		cookieWrite( "" + st_max[1] );
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[0][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[1][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[0][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[1][i] );
		}
		cookieWrite( "" + st_max[2] );
		cookieWrite( "" + st_max[3] );
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[2][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[3][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[2][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[3][i] );
		}
		cookieWrite( "" + st_max[4] );
		cookieWrite( "" + st_max[5] );
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[4][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[5][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[4][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[5][i] );
		}
		cookieWrite( "" + st_max[6] );
		cookieWrite( "" + st_max[7] );
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[6][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_s[7][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[6][i] );
		}
		for( i = 0; i < STAGE_NUM; i++ ){
			cookieWrite( "" + best_t[7][i] );
		}
		endCookieWrite( "config" );
	}
}

/**
 * アプリの状態を変更する
 */
function set_state( new_state ){
	var old_state = state;
	state = new_state;
	_elapse = 0;
	boost = false;

	switch( old_state ){
	case STATE_TITLE:
		if( state == STATE_READY ){
			score = 0;
			bonus = 0;
			jiki_init( true );
		}
		break;
	case STATE_CLEAR:
		add_score( bonus ); bonus = 0;
		if( state != STATE_TITLE ){
			jiki_init( false );
		}
		st_index++; if( st_index > st_max[level] ) st_max[level] = st_index;
		save_config();
		break;
	}

	switch( state ){
	case STATE_TITLE:
		if( st_index >= STAGE_NUM ) new_level();
		save_config();
		quake = 0;
		break;
	case STATE_READY:
		map = true;
		old_life = _DIV( t_damage + (WAIT_1 - 1), WAIT_1 );
		old_score = score;
		bonus = 6800;
		stage_create();
		wave_clear();
		ring.removeAllElements();
		shot.removeAllElements();
		break;
	case STATE_CLEAR:
		bonus_d = bonus;
		new_s = (score + bonus_d) - old_score;
		if( new_s > best_s[level][st_index] ){
			new_score = (best_s[level][st_index] == 0) ? false : true;
			best_s[level][st_index] = new_s;
		} else {
			new_score = false;
		}
		miss = _DIV( t_damage + (WAIT_1 - 1), WAIT_1 ) - old_life;
		new_t = (6800 - bonus_d) + 680 * miss;
		if( new_t < best_t[level][st_index] ){
			new_record = (best_t[level][st_index] == 99999) ? false : true;
			best_t[level][st_index] = new_t;
		} else {
			new_record = false;
		}
		break;
	}
}

/**
 * 描画に使用する色を設定
 */
function setCMYColor( col ){
	switch( col ){
	case 0: g.setColor( COLOR_C ); break;
	case 1: g.setColor( COLOR_M ); break;
	case 2: g.setColor( COLOR_Y ); break;
	}
}

/**
 * ウィンドウに対応した各種描画
 */
function setOrigin( x, y ){
	origin_x = x;
	origin_y = y;
}
function setClip( x, y, w, h ){
	clip_x = x;
	clip_y = y;
	clip_w = w;
	clip_h = h;
}
function drawImage( img, x0, y0, w, h ){
	x0 -= _win_x;
	y0 -= _win_y;
	if( (x0 + w > clip_x) && (x0 < clip_x + clip_w) && (y0 + h > clip_y) && (y0 < clip_y + clip_h) ){
		x0 += origin_x;
		y0 += origin_y;
		g.drawImage( img, x0, y0 );
		return true;
	}
	return false;
}
function drawScaledImage( img, x0, y0, w, h, sx, sy, sw, sh ){
	x0 -= _win_x;
	y0 -= _win_y;
	x0 += origin_x;
	y0 += origin_y;
	g.drawScaledImage( img, x0, y0, w, h, sx, sy, sw, sh );
}
function drawLine( x0, y0, x1, y1 ){
	x0 -= _win_x;
	y0 -= _win_y;
	x1 -= _win_x;
	y1 -= _win_y;
	if(
		((x0 > clip_x) && (x0 < clip_x + clip_w) && (y0 > clip_y) && (y0 < clip_y + clip_h)) ||
		((x1 > clip_x) && (x1 < clip_x + clip_w) && (y1 > clip_y) && (y1 < clip_y + clip_h))
	){
		x0 += origin_x;
		y0 += origin_y;
		x1 += origin_x;
		y1 += origin_y;
		g.drawLine( x0, y0, x1, y1 );
	}
}
function drawRect( x, y, w, h ){
	x -= _win_x;
	y -= _win_y;
	if( (x + w > clip_x) && (x < clip_x + clip_w) && (y + h > clip_y) && (y < clip_y + clip_h) ){
		x += origin_x;
		y += origin_y;
		g.drawRect( x, y, w, h );
	}
}

function frameTime(){ return (state == STATE_LAUNCH) ? 0 : 80; }

#include "image.js"
var load_cnt;

/**
 * start
 */
function start(){
	setCurrent( "canvas0" );

	g = new _ScalableGraphics();
	setGraphics( g );

	document.getElementById( "div0" ).innerHTML = "canvas : " + (canUseCanvas() ? "true" : "false");
	document.getElementById( "div1" ).innerHTML = "text : " + (g.canUseText() ? "true" : "false");
	document.getElementById( "div2" ).innerHTML = "audio : " + (canUseAudio() ? "true" : "false");
	document.getElementById( "div3" ).innerHTML = "audio/mp3 : " + (canPlayType( "audio/mp3" ) ? "true" : "false");
	document.getElementById( "div4" ).innerHTML = "audio/wav : " + (canPlayType( "audio/wav" ) ? "true" : "false");

	g.setScale( 2.0 );
	g.setStrokeWidth( 1.0 );

	var i;

	origin_x = 0;
	origin_y = 0;

	// よく使う色
	COLOR_C = g.getColorOfRGB(   0, 255, 255 );
	COLOR_M = g.getColorOfRGB( 255,   0, 255 );
	COLOR_Y = g.getColorOfRGB( 255, 255,   0 );
	COLOR_K = g.getColorOfRGB(   0,   0,   0 );
	COLOR_R = g.getColorOfRGB( 255,   0,   0 );
	COLOR_G = g.getColorOfRGB(   0, 255,   0 );
	COLOR_W = g.getColorOfRGB( 255, 255, 255 );

	set_state( STATE_LAUNCH );

	st_max = new Array( 8 );
	best_s = new Array( 8 );
	best_t = new Array( 8 );
	for( i = 0; i < 8; i++ ){
		best_s[i] = new Array( STAGE_NUM );
		best_t[i] = new Array( STAGE_NUM );
	}

	rand = new _Random();

	stage_init();

	wave_data = new Array( 18 );
	for( i = 0; i < 18; i++ ){
		wave_data[i] = new Array( 18 );
	}
#ifdef USE_WAVEDRAWDATA
	draw_data = new Array( 18 );
	for( i = 0; i < 18; i++ ){
		draw_data[i] = new Array( 18 );
	}
#endif // USE_WAVEDRAWDATA
	ring = new _Vector( 128 );

	shot = new _Vector( 128 );

	main_img = new Array( IMAGE_NUM );
	load_cnt = -1;
//	for( i = 0; i < IMAGE_NUM; i++ ){
//		main_img[i] = loadImage( "res/" + IMAGE[i] );
//	}

	main_se = new Array( SE_NUM );
	for( i = 0; i < SE_NUM; i++ ){
		main_se[i] = null;
	}
	if( canUseAudio() ){
		if( canPlayType( "audio/mp3" ) ){
			main_se[SE_CURSOR] = loadAudio( "res/mp3/cursor22.mp3" );
			main_se[SE_SELECT] = loadAudio( "res/mp3/cursor07.mp3" );
			main_se[SE_BAKU_S] = loadAudio( "res/mp3/byoro01_a.mp3" );
			main_se[SE_BAKU_L] = loadAudio( "res/mp3/bom16.mp3" );
			main_se[SE_WAVE] = loadAudio( "res/mp3/shoot08.mp3" );
			main_se[SE_SHOT] = loadAudio( "res/mp3/gun30.mp3" );
			main_se[SE_LASER] = loadAudio( "res/mp3/cursor35.mp3" );
			main_se[SE_DAMAGE] = loadAudio( "res/mp3/noise05.mp3" );
			main_se[SE_MOVE] = loadAudio( "res/mp3/tm2_gun005_minigunlp1.mp3" );
		} else if( canPlayType( "audio/wav" ) ){
			main_se[SE_CURSOR] = loadAudio( "res/wav/cursor22.wav" );
			main_se[SE_SELECT] = loadAudio( "res/wav/cursor07.wav" );
			main_se[SE_BAKU_S] = loadAudio( "res/wav/byoro01_a.wav" );
			main_se[SE_BAKU_L] = loadAudio( "res/wav/bom16.wav" );
			main_se[SE_WAVE] = loadAudio( "res/wav/shoot08.wav" );
			main_se[SE_SHOT] = loadAudio( "res/wav/gun30.wav" );
			main_se[SE_LASER] = loadAudio( "res/wav/cursor35.wav" );
			main_se[SE_DAMAGE] = loadAudio( "res/wav/noise05.wav" );
			main_se[SE_MOVE] = loadAudio( "res/wav/tm2_gun005_minigunlp1.wav" );
		}
	} else if( _USE_AUDIOEX ){
		main_se[SE_CURSOR] = loadAudio( "res/wav/cursor22.wav" );
		main_se[SE_SELECT] = loadAudio( "res/wav/cursor07.wav" );
		main_se[SE_BAKU_S] = loadAudio( "res/wav/byoro01_a.wav" );
		main_se[SE_BAKU_L] = loadAudio( "res/wav/bom16.wav" );
		main_se[SE_WAVE] = loadAudio( "res/wav/shoot08.wav" );
		main_se[SE_SHOT] = loadAudio( "res/wav/gun30.wav" );
		main_se[SE_LASER] = loadAudio( "res/wav/cursor35.wav" );
		main_se[SE_DAMAGE] = loadAudio( "res/wav/noise05.wav" );
//		main_se[SE_MOVE] = loadAudio( "res/wav/tm2_gun005_minigunlp1.wav" );
	}

	m_damage = WAIT_1 * JIKI_LIFE;
	jiki_init( true );

	load_config();

	stage_create();

//	set_state( STATE_TITLE );

	return true;
}

// スコア加算
function add_score( point ){ score += point; if( score > hi_score ) hi_score = score; }
function add_bonus( point ){ add_score( point ); bonus -= point; }

// ステージ番号を直す
function st_update(){ if( st_index > st_max[level] ) st_index = st_max[level]; }

/**
 * レベルを上げる
 */
function new_level(){
	level++; if( level > 7 ) level = 0;
	if( level > level_max ) level_max = level;
	st_index = 0;
}

/**
 * 文字列センタリング描画
 */
function centerDrawString( str, type, y ){
	g.setFont( type, _FONT_FAMILY );
	g.drawString( str,
		_DIV( 240 - g.stringWidth( str ), 2 ),
		y + _DIV( g.fontHeight(), 2 )
		);
}

/**
 *
 */
function drawStatusSub( str, x, y ){
	g.setFont( _FONT_SMALL, _FONT_FAMILY );
	g.drawString( str, x - g.stringWidth( str ), y );
}

/**
 * ステージ描画
 */
function drawStage( title ){
	g.setColor( COLOR_K );
	g.fillRect( 0, 0, 240, 240 );
	setOrigin( 12, 12 );
	setClip( 0, 0, 216, 216 );
	stage_draw( title );
}

/**
 * ステータス描画
 */
function drawStatus( title ){
	var y, y2, h, h2;

	if( title || !dark ){
		g.drawImage( main_img[IMAGE_MASK], 0, 0 );
	}

	if( quake > 0 ){
		setOrigin( quake_x, quake_y );
	} else {
		setOrigin( 0, 0 );
	}

	if( title ){
		// 上部固定
		y = 0;
		h = 25;
	} else {
		h = 25;
		y = ((jiki_y - _win_y) < (120 - 24)) ? (240 - 25) : 0;
	}

	// スコア
	g.setFont( _FONT_SMALL, _FONT_FAMILY );
	var h3 = g.fontHeight();
	y2 = (y == 0) ? h : y + h3;
	g.setColor( COLOR_W );
	g.drawString( (h3 > 16) ? "SC" : "SCORE", 0, y2 );
	drawStatusSub( "" + score, 100, y2 );
	g.setColor( COLOR_M );
	g.drawString( "HI", 106, y2 );
	drawStatusSub( "" + hi_score, 184, y2 );
	g.setColor( boost ? COLOR_Y : COLOR_W );
	g.drawString( "T", 190, y2 );
	drawStatusSub( "" + bonus, 239, y2 );

	// ダメージ
	if( y == 0 ){
		y2 = 0;
		h2 = h - h3;
	} else {
		y2 = h3;
		h2 = h - y2;
	}
	var w = _DIV( 240 * t_damage, m_damage );
	if     ( w < 100 ){ g.setColor( COLOR_G ); }
	else if( w < 200 ){ g.setColor( COLOR_Y ); }
	else              { g.setColor( COLOR_R ); }
	g.fillRect( 0, y + y2, w, h2 );
	g.drawRect( 0, y + y2, 239, h2 - 1 );

	// マップ
	if( !title && map ){
		var map_x;
		var map_y;
		map_x = ((jiki_x - _win_x) < 96) ? (240 - 64) : 0;
		if( y == 0 ){
			map_y = h;
		} else if( y == 240 ){
			map_y = ((jiki_y - _win_y) < 96) ? (240 - 64) : 0;
		} else {
			map_y = y - 64;
		}
		stage_draw_map( map_x, map_y );
	}

	if( quake > 0 ){
		setOrigin( 0, 0 );
	}
}

/**
 * paint
 */
function paint(){
	sound_id = -1;
	if( !canUseAudio() ){
		lock_sound--;
	}

	var key = getKeypadState();

	if( quake > 0 ){
		quake_x = rand.next( _DIV( quake + 2, 3 ) );
		quake_y = rand.next( _DIV( quake + 2, 3 ) );
	}

	switch( state ){
	case STATE_LAUNCH:
		g.setColor( COLOR_K );
		g.fillRect( 0, 0, 240, 240 );
		g.setColor( COLOR_W );
		centerDrawString( "NOW LOADING...", _FONT_SMALL, 110 );
		if( !isImageBusy() ){
			load_cnt++;
			if( load_cnt >= IMAGE_NUM ){
				set_state( STATE_TITLE );
			} else {
				main_img[load_cnt] = loadImage( "res/" + IMAGE[load_cnt] );
			}
		}
		g.setColor( COLOR_W );
		g.drawRect( 50, 130, 140, 5 );
		g.fillRect( 50, 130, 140 * load_cnt / IMAGE_NUM, 5 );
		break;
	case STATE_TITLE:
		// 描画
		drawStage( true );
		drawStatus( true );
		setCMYColor( _MOD( _elapse, 3 ) );
		centerDrawString( "TANK BARRIER", _FONT_MEDIUM, 50 );
		switch( level ){
		case 0:
		case 1:
			g.setColor( COLOR_W );
			break;
		case 2:
		case 3:
			g.setColor( COLOR_C );
			break;
		case 4:
		case 5:
			g.setColor( COLOR_M );
			break;
		case 6:
		case 7:
			g.setColor( COLOR_Y );
			break;
		}
		if( _MOD( level, 2 ) == 0 ){
			centerDrawString( "LEVEL EASY", _FONT_SMALL, 90 );
		} else {
			centerDrawString( "LEVEL HARD", _FONT_SMALL, 90 );
		}
		centerDrawString(
			"STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
			_FONT_SMALL,
			115
			);
		g.setColor( COLOR_Y );
		g.drawString( "BEST SCORE ", 145 - g.stringWidth( "BEST SCORE " ), 150 );
		if( best_s[level][st_index] == 0 ){
			g.drawString( "---", 145, 150 );
		} else {
			g.drawString(
				"" + best_s[level][st_index],
				145,
				150
				);
		}
		g.drawString( "BEST TIME ", 145 - g.stringWidth( "BEST TIME " ), 170 );
		if( best_t[level][st_index] == 99999 ){
			g.drawString( "---", 145, 170 );
		} else {
			g.drawString(
				"" + best_t[level][st_index],
				145,
				170
				);
		}
		g.setColor( COLOR_W );
		if(
			((key & keyBit( _KEY_0 )) != 0) ||
			((key & keyBit( _KEY_5 )) != 0) ||
			((key & keyBit( _KEY_Z )) != 0) ||
			((key & keyBit( _KEY_X )) != 0) ||
			((key & keyBit( _KEY_C )) != 0)
		){
			centerDrawString( "LOADING...", _FONT_SMALL, 190 );
		} else {
			if( _MOD( _elapse, WAIT_1 ) <= _DIV( WAIT_1, 2 ) ){
				centerDrawString( "PRESS [0] OR [5] KEY", _FONT_SMALL, 190 );
			}
		}
		centerDrawString( "COPYRIGHT (C) SatisKia", _FONT_TINY, 220 );

		// キーが押されたらゲームモードへ
		if(
			((key & keyBit( _KEY_0 )) != 0) ||
			((key & keyBit( _KEY_5 )) != 0) ||
			((key & keyBit( _KEY_Z )) != 0) ||
			((key & keyBit( _KEY_X )) != 0) ||
			((key & keyBit( _KEY_C )) != 0)
		){
			set_state( STATE_READY );
		}

		break;
	case STATE_READY:
		// 描画
		drawStage( false );
		jiki_draw( false );
		drawStatus( false );
		g.setColor( COLOR_W );
		centerDrawString(
			"STAGE " + ((st_index < 9) ? "0" : "") + (st_index + 1),
			_FONT_SMALL,
			115
			);
		centerDrawString( "R E A D Y", _FONT_SMALL, 135 );

		// 一定時間過ぎたらゲーム開始
		if( _elapse > WAIT_2 ){
			set_state( STATE_PLAY );
		}

		break;
	case STATE_PLAY:
		// ブースト
		if( (level < 2) || (level > 3) ){
			boost = (
				((key & keyBit( _KEY_5 )) != 0) ||
				((key & keyBit( _KEY_Z )) != 0) ||
				((key & keyBit( _KEY_X )) != 0) ||
				((key & keyBit( _KEY_C )) != 0)
				) ? true : false;
		}

		if( bonus > 0 ){
			bonus -= (boost ? 2 : 1); if( bonus < 0 ) bonus = 0;
		}

		// 更新
		stage_update( false );
		wave_update();
		shots_update();

		// 自機の移動
		if     ( ((key & keyBit( _KEY_8 )) != 0) || ((key & keyBit( _KEY_DOWN  )) != 0) ) jiki_down ();
		else if( ((key & keyBit( _KEY_4 )) != 0) || ((key & keyBit( _KEY_LEFT  )) != 0) ) jiki_left ();
		else if( ((key & keyBit( _KEY_6 )) != 0) || ((key & keyBit( _KEY_RIGHT )) != 0) ) jiki_right();
		else if( ((key & keyBit( _KEY_2 )) != 0) || ((key & keyBit( _KEY_UP    )) != 0) ) jiki_up   ();
		else jiki_inertia();

		// 自機のダメージ
		if( wave_hit() || shots_hit() || stage_spear() ){
			if( _muteki <= 0 ){
				if( _damage == 0 ) _damage++;
			}
		}

		// 描画
		drawStage( false );
#ifndef WAVE_FULLTIME
		if( _MOD( _elapse, 2 ) == 0 ){
#endif // WAVE_FULLTIME
			wave_draw();
#ifndef WAVE_FULLTIME
		}
#endif // WAVE_FULLTIME
		jiki_draw();
		shots_draw();
		stage_attack();
		drawStatus( false );
		if( _elapse < WAIT_2 ){
			g.setColor( COLOR_W );
			centerDrawString( "S T A R T !", _FONT_SMALL, 125 );
		}

		if( stage_destroyed() ){
			// ステージクリア
			set_state( STATE_CLEAR );
		} else if( t_damage >= m_damage ){
			// ゲームオーバー
			set_state( STATE_GAMEOVER );
		}

		break;
	case STATE_CLEAR:
		if( _MOD( bonus, 200 ) > 0 ){
			add_bonus( _MOD( bonus, 200 ) );
			_elapse = 0;
		} else if( bonus >= 200 ){
			add_bonus( 200 );
			_elapse = 0;
		}

		// 更新
		stage_update( true );

		// 描画
		drawStage( false );
		jiki_draw( false );
		drawStatus( false );
		g.setColor( COLOR_W );
		{
			centerDrawString( "C L E A R !", _FONT_SMALL, 105 );
			var str = ((g.fontHeight() > 16) ? "SC " : "SCORE ") + new_s;
			if( bonus_d > 0 ){
				str = str + "(BONUS " + bonus_d + ")";
			}
			if( new_score ){
				str = str + " UP!";
			}
			centerDrawString( str, _FONT_SMALL, 125 );
			str = "TIME " + new_t;
			if( miss > 0 ){
				str = str + "(MISS " + miss + ")";
			}
			if( new_record ){
				str = str + " UP!";
			}
			centerDrawString( str, _FONT_SMALL, 145 );
		}

		// 一定時間過ぎたらゲーム開始
		if( _elapse > WAIT_2 ){
			set_state( STATE_READY );
		}

		break;
	case STATE_GAMEOVER:
		// 更新
		stage_update( false );
		if( _MOD( _elapse, RING_FRAME ) == 0 ){
			wave_update();
		}
		shots_update();

		// 描画
		drawStage( false );
#ifndef WAVE_FULLTIME
		if( _MOD( _elapse, 2 ) == 0 ){
#endif // WAVE_FULLTIME
			wave_draw();
#ifndef WAVE_FULLTIME
		}
#endif // WAVE_FULLTIME
		jiki_draw( false );
		shots_draw();
		drawStatus( false );
		g.setColor( COLOR_W );
		centerDrawString( "G A M E  O V E R", _FONT_SMALL, 125 );

		// 一定時間過ぎたらタイトル画面へ
		if( _elapse > WAIT_4 ){
			set_state( STATE_TITLE );
		}

		break;
	}

	_elapse++;
	if( quake > 0 ) quake--;
}

function processEvent( type, param ){
	switch( type ){
	case _KEY_PRESSED_EVENT:
		switch( state ){
		case STATE_LAUNCH:
			break;
		case STATE_TITLE:
			{
				var old_level = level;
				var old_st_index = st_index;
				switch( param ){
				case _KEY_2:
				case _KEY_UP:
					level--; if( level < 0 ) level = 0;
					st_update();
					if( level != old_level ){
play_sound( SE_CURSOR );
					}
					break;
				case _KEY_8:
				case _KEY_DOWN:
					level++; if( level > level_max ) level = level_max;
					st_update();
					if( level != old_level ){
play_sound( SE_CURSOR );
					}
					break;
				case _KEY_4:
				case _KEY_LEFT:
					st_index--; if( st_index < 0 ) st_index = 0;
					if( st_index != old_st_index ){
play_sound( SE_CURSOR );
					}
					break;
				case _KEY_6:
				case _KEY_RIGHT:
					st_index++; if( st_index >= STAGE_NUM ) st_index = STAGE_NUM - 1;
					st_update();
					if( st_index != old_st_index ){
play_sound( SE_CURSOR );
					}
					break;
				}
			}
			break;
		default:
			switch( param ){
			case _KEY_1:
			case _KEY_CTRL:
				map = map ? false : true;
				break;
			case _KEY_3:
			case _KEY_SPACE:
				set_state( STATE_TITLE );
				break;
//			case _KEY_ASTERISK:
			case _KEY_Z:
				_barrier = 0;
				break;
//			case _KEY_0:
			case _KEY_X:
				_barrier = 1;
				break;
//			case _KEY_POUND:
			case _KEY_C:
				_barrier = 2;
				break;
			}
			break;
		}
		break;
	}
}

/**
 * 弾を更新する
 */
function shots_update(){
	var i;
	var tmp;
	for( i = shot.size() - 1; i >= 0; i-- ){
		tmp = shot.elementAt( i );
		tmp.update();

		// 座標判定
		var x = tmp._x;
		var y = tmp._y;
		if( x <= -12 || x >= 960 || y <= -12 || y >= 960 ){
			shot.removeElementAt( i );
		} else if( _DIV( base_data[_DIV( _DIV( x + 6, 12 ), 2 )][_DIV( _DIV( y + 6, 12 ), 2 )], base ) == BASE_KABE ){
			shot.removeElementAt( i );
		}
	}
}

/**
 * 当たり判定
 */
function shots_hit(){
	var i;
	var _hit = false;
	var x = jiki_x + 6;
	var y = jiki_y + 6;
	var tmp;
	for( i = shot.size() - 1; i >= 0; i-- ){
		tmp = shot.elementAt( i );
		if( (Math.abs( tmp._x - x ) < 12) && (Math.abs( tmp._y - y ) < 12) ){
			_hit = true;
			shot.removeElementAt( i );
		}
	}
	return _hit;
}

/**
 * 描画
 */
function shots_draw(){
	var i;
	var tmp;
	for( i = shot.size() - 1; i >= 0; i-- ){
		tmp = shot.elementAt( i );
		drawImage( main_img[IMAGE_SHOT], tmp._x + 1, tmp._y + 1, 10, 10 );
	}
}

/**
 * 点を描く
 */
function wave_put12( x0, y0, x1, y1, col ){
	var x2 = x1 - _DIV( _win_x, 12 );
	var y2 = y1 - _DIV( _win_y, 12 );
	if( x2 < 0 || x2 >= 18 || y2 < 0 || y2 >= 18 ) return false;
	if( stage_kabe12l( x0, y0, x1, y1 ) ) return false;
	wave_data[x2][y2] = col;
	return true;
}

/**
 * クリア
 */
function wave_clear(){
	var i, j;
	for( i = 0; i < 18; i++ ){
		for( j = 0; j < 18; j++ ){
			wave_data[i][j] = -1;
		}
	}
}

/**
 * ウェーブデータ更新
 */
function wave_update(){
	var i, j;
	var tmp;

	wave_clear();

	for( i = ring.size() - 1; i >= 0; i-- ){
		tmp = ring.elementAt( i );
		if( _MOD( _elapse, RING_FRAME ) == 0 ){
			tmp.update();
		}

		// 円を描く
		var ret = false;
		var x0 = tmp._x;
		var y0 = tmp._y;
		var r = tmp._elapse;
		var col = tmp._col;
		var x = r;
		var y = 0;
		var f = -2 * r + 3;
		while( x >= y ){
			if( wave_put12( x0, y0, x0 + x, y0 + y, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 - x, y0 + y, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 + x, y0 - y, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 - x, y0 - y, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 + y, y0 + x, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 - y, y0 + x, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 + y, y0 - x, col ) ) ret = true;
			if( wave_put12( x0, y0, x0 - y, y0 - x, col ) ) ret = true;
			if( f >= 0 ){
				x--;
				f -= 4 * x;
			}
			y++;
			f += 4 * y + 2;
		}

		if( r > 113 ){
			if( ret == false ){
				ring.removeElementAt( i );
			}
		}
	}

	for( j = 1; j < 17; j++ ){
		for( i = 1; i < 17; i++ ){
			if( wave_data[i][j] >= 0 ){
				if(
					(wave_data[i - 1][j - 1] != wave_data[i][j]) &&
					(wave_data[i    ][j - 1] != wave_data[i][j]) &&
					(wave_data[i + 1][j - 1] != wave_data[i][j]) &&
					(wave_data[i - 1][j    ] != wave_data[i][j]) &&
					(wave_data[i + 1][j    ] != wave_data[i][j]) &&
					(wave_data[i - 1][j + 1] != wave_data[i][j]) &&
					(wave_data[i    ][j + 1] != wave_data[i][j]) &&
					(wave_data[i + 1][j + 1] != wave_data[i][j])
				){
					wave_data[i][j] = -1;
				}
			}
		}
	}
}

/**
 * 当たり判定
 */
function wave_hit(){
	var x = _DIV( jiki_x + 6, 12 );
	var y = _DIV( jiki_y + 6, 12 );
	x -= _DIV( _win_x, 12 );
	y -= _DIV( _win_y, 12 );
	if( (wave_data[x    ][y    ] >= 0) && (wave_data[x    ][y    ] != _barrier) ) return true;
	if( (wave_data[x + 1][y    ] >= 0) && (wave_data[x + 1][y    ] != _barrier) ) return true;
	if( (wave_data[x    ][y + 1] >= 0) && (wave_data[x    ][y + 1] != _barrier) ) return true;
	if( (wave_data[x + 1][y + 1] >= 0) && (wave_data[x + 1][y + 1] != _barrier) ) return true;
	return false;
}

/**
 * 描画
 */
function wave_draw(){
	var i, j, k, x, y;

	var xx = origin_x - _MOD( _win_x, 12 );
	var yy = origin_y - _MOD( _win_y, 12 );

	g.setAlpha( 192 );

#ifdef USE_WAVEDRAWDATA
	// 横に連なっている所を描画
	for( j = 0; j < 18; j++ ){
		y = j * 12;
		for( i = 0; i < 18; ){
			if( wave_data[i][j] >= 0 ){
				for( k = i + 1; k < 18; k++ ){
					if( wave_data[k][j] != wave_data[i][j] ) break;
				}
				if( k - i > 1 ){
					setCMYColor( wave_data[i][j] );
					g.fillRect( i * 12 + xx, y + yy, 12 * (k - i), 12 );
					for( ; i < k; i++ ){
						draw_data[i][j] = -1;
					}
				} else {
					draw_data[i][j] = wave_data[i][j];
					i++;
				}
			} else {
				draw_data[i][j] = -1;
				i++;
			}
		}
	}

	// 縦に連なっている所を描画
	for( i = 0; i < 18; i++ ){
		x = i * 12;
		for( j = 0; j < 18; ){
			if( draw_data[i][j] >= 0 ){
				for( k = j + 1; k < 18; k++ ){
					if( draw_data[i][k] != draw_data[i][j] ) break;
				}
				if( k - j > 1 ){
					setCMYColor( draw_data[i][j] );
					g.fillRect( x + xx, j * 12 + yy, 12, 12 * (k - j) );
					for( ; j < k; j++ ){
						draw_data[i][j] = -1;
					}
				} else {
					j++;
				}
			} else {
				j++;
			}
		}
	}

	// 残った所を描画
	for( j = 0; j < 18; j++ ){
		y = j * 12;
		for( i = 0; i < 18; i++ ){
			if( draw_data[i][j] >= 0 ){
				setCMYColor( draw_data[i][j] );
				g.fillRect( i * 12 + xx, y + yy, 12, 12 );
			}
		}
	}
#else
	for( j = 0; j < 18; j++ ){
		y = j * 12;
		for( i = 0; i < 18; i++ ){
			if( wave_data[i][j] >= 0 ){
				setCMYColor( wave_data[i][j] );
				g.fillRect( i * 12 + xx, y + yy, 12, 12 );
			}
		}
	}
#endif // USE_WAVEDRAWDATA

	g.setAlpha( 255 );
}

/**
 * イメージ読み込み
 */
function jiki_load_image(){
	switch( level ){
	case 0:
	case 1:
		_img = IMAGE_JIKI_0;
		break;
	case 2:
	case 3:
		_img = IMAGE_JIKIP_0;
		break;
	case 4:
	case 5:
		_img = IMAGE_JIKIM_0;
		break;
	case 6:
	case 7:
		_img = IMAGE_JIKID_0;
		break;
	}
}

/**
 * 初期化
 */
function jiki_init( start ){
	if( start ){
		_life = JIKI_LIFE;
	} else {
		_life++;
		if( _life <= 0 ) _life = 1;
		if( _life > JIKI_LIFE ) _life = JIKI_LIFE;
	}
	t_damage = m_damage - (_life * WAIT_1);

	jiki_x     = 468;
	jiki_y     = 924;
	pattern_x  = 0;
	pattern_y  = 0;
	_mode      = BASE_NORMAL;
	_direction = DIRECTION_U;
	jiki_set_dsp();
	jiki_set_light( true );
	_barrier   = 0;
	_damage    = 0;
	_muteki    = 0;
}

/**
 *
 */
function jiki_set_dsp(){
	dsp_x = jiki_x;
	dsp_y = jiki_y;
	if( _mode == BASE_SLOW ){
		dsp_x += rand.next( 3 );
		dsp_y += rand.next( 3 );
play_sound( SE_MOVE );
	}
}

/**
 *
 */
function jiki_set_light( force ){
	if( dark || force ){
		_light_x = dsp_x - 48;
		_light_y = dsp_y - 48;
		switch( _direction ){
		case DIRECTION_D: _light_y += 36; break;
		case DIRECTION_L: _light_x -= 36; break;
		case DIRECTION_R: _light_x += 36; break;
		case DIRECTION_U: _light_y -= 36; break;
		}
	}
}

/**
 * 下移動
 */
function jiki_down(){
	if( _damage > 0 ) return;
	_direction = DIRECTION_D;
	var old_y = jiki_y;
	switch( _mode ){
	case BASE_NORMAL : jiki_y += JIKI_MOVE2; break;
	case BASE_SLOW   : jiki_y += JIKI_MOVE1; break;
	case BASE_INERTIA: jiki_y += JIKI_MOVE2; break;
	}
	_mode = stage_hit( jiki_x, jiki_y );
	if( _mode == BASE_KABE ){
		jiki_y = old_y + JIKI_MOVE1;
		_mode = stage_hit( jiki_x, jiki_y );
		if( _mode == BASE_KABE ){
			jiki_y = old_y;
		}
	}
	jiki_set_dsp();
	jiki_set_light( false );
	pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
	pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
	if( _mode != BASE_INERTIA ){
play_sound( SE_MOVE );
	}
}

/**
 * 左移動
 */
function jiki_left(){
	if( _damage > 0 ) return;
	_direction = DIRECTION_L;
	var old_x = jiki_x;
	switch( _mode ){
	case BASE_NORMAL : jiki_x -= JIKI_MOVE2; break;
	case BASE_SLOW   : jiki_x -= JIKI_MOVE1; break;
	case BASE_INERTIA: jiki_x -= JIKI_MOVE2; break;
	}
	_mode = stage_hit( jiki_x, jiki_y );
	if( _mode == BASE_KABE ){
		jiki_x = old_x - JIKI_MOVE1;
		_mode = stage_hit( jiki_x, jiki_y );
		if( _mode == BASE_KABE ){
			jiki_x = old_x;
		}
	}
	jiki_set_dsp();
	jiki_set_light( false );
	pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
	pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
	if( _mode != BASE_INERTIA ){
play_sound( SE_MOVE );
	}
}

/**
 * 右移動
 */
function jiki_right(){
	if( _damage > 0 ) return;
	_direction = DIRECTION_R;
	var old_x = jiki_x;
	switch( _mode ){
	case BASE_NORMAL : jiki_x += JIKI_MOVE2; break;
	case BASE_SLOW   : jiki_x += JIKI_MOVE1; break;
	case BASE_INERTIA: jiki_x += JIKI_MOVE2; break;
	}
	_mode = stage_hit( jiki_x, jiki_y );
	if( _mode == BASE_KABE ){
		jiki_x = old_x + JIKI_MOVE1;
		_mode = stage_hit( jiki_x, jiki_y );
		if( _mode == BASE_KABE ){
			jiki_x = old_x;
		}
	}
	jiki_set_dsp();
	jiki_set_light( false );
	pattern_x++; if( pattern_x > 4 ) pattern_x = 4;
	pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
	if( _mode != BASE_INERTIA ){
play_sound( SE_MOVE );
	}
}

/**
 * 上移動
 */
function jiki_up(){
	if( _damage > 0 ) return;
	_direction = DIRECTION_U;
	var old_y = jiki_y;
	switch( _mode ){
	case BASE_NORMAL : jiki_y -= JIKI_MOVE2; break;
	case BASE_SLOW   : jiki_y -= JIKI_MOVE1; break;
	case BASE_INERTIA: jiki_y -= JIKI_MOVE2; break;
	}
	_mode = stage_hit( jiki_x, jiki_y );
	if( _mode == BASE_KABE ){
		jiki_y = old_y - JIKI_MOVE1;
		_mode = stage_hit( jiki_x, jiki_y );
		if( _mode == BASE_KABE ){
			jiki_y = old_y;
		}
	}
	jiki_set_dsp();
	jiki_set_light( false );
	pattern_x--; if( pattern_x < 0 ) pattern_x = 0;
	pattern_y++; if( pattern_y > 1 ) pattern_y = 0;
	if( _mode != BASE_INERTIA ){
play_sound( SE_MOVE );
	}
}

/**
 * 慣性移動
 */
function jiki_inertia(){
	if( _mode == BASE_INERTIA ){
		switch( _direction ){
		case DIRECTION_D: jiki_down (); break;
		case DIRECTION_L: jiki_left (); break;
		case DIRECTION_R: jiki_right(); break;
		case DIRECTION_U: jiki_up   (); break;
		}
	}
}

/**
 * 描画
 */
function jiki_draw(){
	var i;

	// ダメージ中の場合...
	if( _damage > 0 ){
		if( _life > 0 ){
			drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
			g.setColor( COLOR_W );
			for( i = 0; i < 3; i++ ){
				drawLine(
					dsp_x + 12 + rand.next( 13 ),
					dsp_y + 12 + rand.next( 13 ),
					dsp_x + 12 + rand.next( 13 ),
					dsp_y + 12 + rand.next( 13 )
					);
			}
			if( _damage == 1 ){
play_sound( SE_DAMAGE );
			}
			_damage++;
			t_damage++;
			if( _damage > WAIT_1 ){
				_damage = 0;
				_life--;
				if( _life == 0 ){
					if( _muteki <= 0 ){
						if( _damage == 0 ) _damage++;
					}
				} else {
					_muteki = WAIT_2;
				}
			}
		} else {
			stage_baku( dsp_x, dsp_y, 99, _damage );
			_damage++;
		}
		return;
	}

	// 無敵中の場合...
	if( _muteki > 0 ){
		_muteki--;
		if( _MOD( _muteki, 2 ) > 0 ){
			drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
		}
	} else {
		drawImage( main_img[_img + pattern_y * 5 + pattern_x], dsp_x, dsp_y, 26, 26 );
	}

	// バリアの表示
	setCMYColor( _barrier );
	drawRect(
		jiki_x - 2 + rand.next( 3 ),
		jiki_y - 2 + rand.next( 3 ),
		26,
		26
		);
}

function error(){
	launch( "error.html" );
}
