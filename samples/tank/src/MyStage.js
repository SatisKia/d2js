#include "Main.h"

var chip = 1;				// パーツ画像の横方向チップ数
var line = 1;				//
var base = 1;				// ベース判定用
var bg_image;				// 背景イメージ
var base_data;				// ベース情報
var base_image;				// ベース画像
var base_x, base_y;			//
var back_image = -1;		// 背景イメージ
var enemy;					// 敵情報
var enemy_size;				//
var _attack;				// 最後に攻撃した敵のインデックス
var attack_x, attack_y;		// 自機が攻撃した位置
var attack_x1, attack_y1;	//
var attack_x2, attack_y2;	//
var pattern;

function stage_init(){
	var i, j;
	base_data = new Array( 41 );
	for( i = 0; i < 41; i++ ){
		base_data[i] = new Array( 41 );
	}
	enemy = new _Vector( 128 );
	_attack = -1;
}

/**
 * ステージデータ読み込み
 */
function stage_load(){
	var i, j;
	var stage_data;

	chip = 1;
	line = 1;
	base = 1;
	bg_image = -1;
	dark = false;
	switch( st_index ){
	case 0:
		base_image = IMAGE_BASE0;
		chip = 10;
		line = 2;
		base = chip * line;
		stage_data = new StageData0();
		break;
	case 1:
		base_image = IMAGE_BASE1;
		chip = 12;
		line = 2;
		base = chip * line;
		bg_image = IMAGE_BACK1;
		stage_data = new StageData1();
		break;
	case 2:
		base_image = IMAGE_BASE2;
		dark = true;
		chip = 12;
		line = 2;
		base = chip * line;
		stage_data = new StageData2();
		break;
	case 3:
		base_image = IMAGE_BASE3;
		chip = 7;
		line = 1;
		base = chip * line;
		stage_data = new StageData3();
		break;
	case 4:
		base_image = IMAGE_BASE4;
		chip = 13;
		line = 2;
		base = chip * line;
		stage_data = new StageData4();
		break;
	case 5:
		base_image = IMAGE_BASE5;
		chip = 12;
		line = 10;
		base = chip * line;
		bg_image = IMAGE_BACK5;
		stage_data = new StageData5();
		break;
	}

	for( i = 0; i < 40; i++ ){
		for( j = 0; j < 40; j++ ){
			base_data[j][i] = stage_data.MAP[i][j];
		}
	}

	enemy.removeAllElements();
	enemy_size = 0;
	var val = new Array( 7 );
	for( j = 0; ; j++ ){
		for( i = 0; i < 7; i++ ){
			val[i] = stage_data.ENEMY[j][i];
		}
		if( val[0] == E_END ){
			break;
		}
		val[1] *= 24;
		val[2] *= 24;
		if( val[6] < 10 ) val[6] *= 30;
		switch( val[0] ){
		case E_ALL:
			if( _MOD( level, 2 ) == 1 ){
				if( val[3] < 4 ){
					val[4] = _DIV( val[4] * 2, 3 );
				} else {
					val[4] = _DIV( val[4], 2 );
				}
				val[5] %= val[4];
			}
			enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
			break;
		case E_EASY:
			if( _MOD( level, 2 ) == 0 ){
				enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
			}
			break;
		case E_HARD:
			if( _MOD( level, 2 ) == 1 ){
				enemy.addElement( new Enemy( val[1], val[2], val[3], val[4], val[5], val[6] ) );
			}
			break;
		}
	}
	enemy_size = enemy.size();
}

/**
 * ステージデータ構築
 */
function stage_create(){
	// ステージデータ読み込み
	if( st_index > 5 ){
		// これ以上ステージが無いので最初に戻る
		new_level();
	}
	stage_load();

	// 自機イメージ読み込み
	jiki_load_image();

	attack_x = -1;
	pattern = 0;
}

/**
 * ステージデータ更新
 */
function stage_update( stage_clear ){
	var i;
	var tmp;
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		tmp.update( stage_clear );
	}

	if( !stage_clear ){
		pattern++; if( pattern > 1 ) pattern = 0;
	}
}

/**
 * 自機の敵への攻撃
 */
function stage_attack(){
	if( t_damage >= m_damage ) return;
var damage = false;
	var i, j;
	var jx = jiki_x + 12;
	var jy = jiki_y + 12;
	var ex, ey;
	var tmp;
	j = -1;
	if( (level < 4) || (level > 5) ){
		var w;
		var h;
		var dist = 96 * 96;
		var tmp_d;
		for( i = enemy_size - 1; i >= 0; i-- ){
			tmp = enemy.elementAt( i );
			if( tmp._damage < tmp.m_damage ){
				ex = tmp._x + 12;
				ey = tmp._y + 12;
				w = jx - ex;
				h = jy - ey;
				tmp_d = w * w + h * h;
				if( tmp_d <= dist ){
					if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
						j = i;
						dist = tmp_d;
					}
				}
			}
		}
		if( j >= 0 ){
			tmp = enemy.elementAt( j );
			if( level < 4 ){
				setCMYColor( _MOD( _elapse, 3 ) );
			} else {
				if( dist <= 32 * 32 ){
					g.setColor( COLOR_W );
				} else if( dist <= 64 * 64 ){
					g.setColor( COLOR_Y );
				} else {
					g.setColor( COLOR_M );
				}
			}
			attack_x = tmp._x + 12 + rand.next( 9 );
			attack_y = tmp._y + 12 + rand.next( 9 );
			if( attack_x >= 0 ){
				if( boost ){
					attack_x1 = jx       + _DIV( attack_x - jx, 3 ) + rand.next( 9 );
					attack_y1 = jy       + _DIV( attack_y - jy, 3 ) + rand.next( 9 );
					attack_x2 = attack_x - _DIV( attack_x - jx, 3 ) + rand.next( 9 );
					attack_y2 = attack_y - _DIV( attack_y - jy, 3 ) + rand.next( 9 );
					drawLine( jx, jy, attack_x1, attack_y1 );
					drawLine( attack_x1, attack_y1, attack_x2, attack_y2 );
					drawLine( attack_x2, attack_y2, attack_x, attack_y );
				} else {
					drawLine( jx, jy, attack_x, attack_y );
				}
			}
			if( level < 4 ){
				tmp._damage += (boost ? 2 : 1); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
			} else {
				if( dist <= 32 * 32 ){
					tmp._damage += (boost ? 6 : 3); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
				} else if( dist <= 64 * 64 ){
					tmp._damage += (boost ? 4 : 2); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
				} else {
					tmp._damage += (boost ? 2 : 1); if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
				}
			}
			if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
		}
	} else {
		if( boost ){
			for( i = enemy_size - 1; i >= 0; i-- ){
				tmp = enemy.elementAt( i );
				if( (tmp._damage < tmp.m_damage) && tmp._show ){
					ex = tmp._x + 12;
					ey = tmp._y + 12;
					if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
						setCMYColor( _MOD( _elapse, 3 ) );
						attack_x = rand.next( 9 );
						attack_y = rand.next( 9 );
						drawLine( jx, jy, tmp._x + 12 + attack_x, tmp._y + 12 + attack_y );
						tmp._damage += 1; if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
						if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
					}
				}
			}
		} else {
			var k;
			for( k = 0; k < 2; k++ ){
				for( i = _attack + 1; i < enemy_size; i++ ){
					tmp = enemy.elementAt( i );
					if( (tmp._damage < tmp.m_damage) && tmp._show ){
						ex = tmp._x + 12;
						ey = tmp._y + 12;
						if( !stage_kabe12l( _DIV( ex, 12 ), _DIV( ey, 12 ), _DIV( jx, 12 ), _DIV( jy, 12 ) ) ){
							j = i;
							break;
						}
					}
				}
				if( j >= 0 ){
					_attack = j;
					break;
				}
				_attack = -1;
			}
			if( j >= 0 ){
				tmp = enemy.elementAt( j );
				setCMYColor( _MOD( _elapse, 3 ) );
				attack_x = rand.next( 9 );
				attack_y = rand.next( 9 );
				drawLine( jx, jy, tmp._x + 12 + attack_x, tmp._y + 12 + attack_y );
				tmp._damage += 1; if( tmp._damage >= tmp.m_damage ) tmp._elapse = 0;
damage = true;
				if( tmp._damage >= tmp.m_damage ) add_score( tmp.m_damage * 10 );
			}
		}
	}
	if( damage ){
play_sound( SE_LASER );
	}
}

/**
 * 敵が全滅したかどうかチェック
 */
function stage_destroyed(){
	var i;
	var tmp;
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( (tmp._type == ENEMY_0) && (tmp._damage < tmp.m_damage) ) return false;
	}
	return true;
}

/**
 * 当たり判定
 */
function stage_hit( x, y ){
	if( (x < 0) || (x > 936) || (y < 0) || (y > 936) ) return BASE_KABE;
	var x2 = _DIV( x + 12, 24 );
	var y2 = _DIV( y + 12, 24 );
	var x3 = _DIV( x, 24 );
	var y3 = _DIV( y, 24 );
	var x4 = x3 + 1;
	var y4 = y3 + 1;
	var slow = false;

	// 敵との当たり判定
	var i;
	var tmp;
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( tmp._damage >= tmp.m_damage ){
			if( (tmp._type == ENEMY_0) || (tmp._type == ENEMY_4) ){
				if( (_DIV( tmp._x, 24 ) == x2) && (_DIV( tmp._y, 24 ) == y2) ) slow = true;
			}
		} else if( (x != tmp._x) || (y != tmp._y) ){
			if( (Math.abs( tmp._x - x ) < 24) && (Math.abs( tmp._y - y ) < 24) ) return BASE_KABE;
		}
	}

	// 自機との当たり判定
	if( (x != jiki_x) || (y != jiki_y) ){
		if( (Math.abs( jiki_x - x ) < 24) && (Math.abs( jiki_y - y ) < 24) ) return BASE_KABE;
	}

	// ベースとの当たり判定
	if( (_MOD( x, 24 ) != 0) && (_MOD( y, 24 ) != 0) ){
		if( _DIV( base_data[x3][y3], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x3][y4], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x4][y3], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x4][y4], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x3][y3], base ) == BASE_GUARDRAIL ) return BASE_KABE;
		if( _DIV( base_data[x3][y4], base ) == BASE_GUARDRAIL ) return BASE_KABE;
		if( _DIV( base_data[x4][y3], base ) == BASE_GUARDRAIL ) return BASE_KABE;
		if( _DIV( base_data[x4][y4], base ) == BASE_GUARDRAIL ) return BASE_KABE;
	} else if( _MOD( x, 24 ) != 0 ){
		if( _DIV( base_data[x3][y3], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x4][y3], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x3][y3], base ) == BASE_GUARDRAIL ) return BASE_KABE;
		if( _DIV( base_data[x4][y3], base ) == BASE_GUARDRAIL ) return BASE_KABE;
	} else if( _MOD( y, 24 ) != 0 ){
		if( _DIV( base_data[x3][y3], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x3][y4], base ) == BASE_KABE      ) return BASE_KABE;
		if( _DIV( base_data[x3][y3], base ) == BASE_GUARDRAIL ) return BASE_KABE;
		if( _DIV( base_data[x3][y4], base ) == BASE_GUARDRAIL ) return BASE_KABE;
	}
	return slow ? BASE_SLOW : _DIV( base_data[x2][y2], base );
}

/**
 * 槍との当たり判定
 */
function stage_spear(){
	var i;
	var tmp;
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( (tmp._damage < tmp.m_damage) && (tmp._type == ENEMY_6) ){
			if(
				(tmp._sx >= jiki_x     ) &&
				(tmp._sx <  jiki_x + 24) &&
				(tmp._sy >= jiki_y     ) &&
				(tmp._sy <  jiki_y + 24)
			){
				return true;
			}
		}
	}
	return false;
}

/**
 * 直線が壁に遮られているかチェック(注意：画面外チェックは行っていない)
 */
function stage_kabe12l( x0, y0, x1, y1 ){
	var i;
	var e, x, y;
	var dx, dy, sx, sy;
	sx = (x1 > x0) ? 1 : -1;
	dx = (x1 > x0) ? x1 - x0 : x0 - x1;
	sy = (y1 > y0) ? 1 : -1;
	dy = (y1 > y0) ? y1 - y0 : y0 - y1;
	x = x0;
	y = y0;
	if( dx >= dy ){
		e = -dx;
		for( i = 0; i <= dx; i++ ){
			if( _DIV( base_data[_DIV( x, 2 )][_DIV( y, 2 )], base ) == BASE_KABE ) return true;
			x += sx;
			e += 2 * dy;
			if( e >= 0 ){
				y += sy;
				e -= 2 * dx;
			}
		}
	} else {
		e = -dy;
		for( i = 0; i <= dy; i++ ){
			if( _DIV( base_data[_DIV( x, 2 )][_DIV( y, 2 )], base ) == BASE_KABE ) return true;
			y += sy;
			e += 2 * dx;
			if( e >= 0 ){
				x += sx;
				e -= 2 * dy;
			}
		}
	}
	return false;
}

/**
 * 爆発
 */
function stage_baku( x, y, w, elapse ){
	var i;
	if( elapse == 1 ){
		if( w > 26 ){
play_sound( SE_BAKU_L );
		} else {
play_sound( SE_BAKU_S );
		}
	}
	i =  _DIV( elapse, BAKU_FRAME ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + i * 2, y + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
	if( w > 26 ){
		if( i == 0 ) quake = 15;
		i = _DIV( elapse - BAKU_LAG1, BAKU_FRAME ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x - 6 + i * 2, y - 6 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
		i = _DIV( elapse - BAKU_LAG2, BAKU_FRAME ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + 6 + i * 2, y - 2 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
		i = _DIV( elapse - BAKU_LAG3, BAKU_FRAME ); if( (i >= 0) && (i < 5) ) drawScaledImage( main_img[IMAGE_BAKU], x + 2 + i * 2, y + 6 + i * 2, 24 - i * 4, 24 - i * 4, 0, 0, 24, 24 );
	}
}

/**
 * 描画
 */
function stage_draw( title ){
	var i, j, x, y, w, h;
	var y2, y3;
	var qx, qy;

	_win_x = jiki_x - 96;
	_win_y = jiki_y - 96;
	if( _win_x < 0 ){
		_win_x = 0;
	} else if( _win_x + 216 > 960 ){
		_win_x = 960 - 216;
	}
	if( _win_y < 0 ){
		_win_y = 0;
	} else if( _win_y + 216 > 960 ){
		_win_y = 960 - 216;
	}

	if( !title && dark ){
		setClip( _light_x - _win_x, _light_y - _win_y, 120, 120 );
	}
	if( quake > 0 ){
		qx = quake_x;
		qy = quake_y;
		setOrigin( 12 + qx, 12 + qy );
	} else {
		qx = 0;
		qy = 0;
	}
	if( bg_image >= 0 ){
		// 背景の描画
		x = _DIV( _win_x, 3 );
		y = _DIV( _win_y, 3 );
		w = 240 - x;
		h = 240 - y;
		if( w > 0 && h > 0 ){ g.drawScaledImage( main_img[bg_image], -x + origin_x, -y + origin_y, 240, 240, 0, 0, 120, 120 ); }
		if( x > 0 && h > 0 ){ g.drawScaledImage( main_img[bg_image],  w + origin_x, -y + origin_y, 240, 240, 0, 0, 120, 120 ); }
		if( w > 0 && y > 0 ){ g.drawScaledImage( main_img[bg_image], -x + origin_x,  h + origin_y, 240, 240, 0, 0, 120, 120 ); }
		if( x > 0 && y > 0 ){ g.drawScaledImage( main_img[bg_image],  w + origin_x,  h + origin_y, 240, 240, 0, 0, 120, 120 ); }
	}
	drawScaledImage( main_img[base_image], 0, 0, 960, 960, 0, 0, 480, 480 );
	if( quake > 0 ){
		setOrigin( 12, 12 );
	}

	if( title ){
		return;
	}

	var tmp;
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( tmp._damage >= tmp.m_damage ){
			if( (tmp._type == ENEMY_0) || (tmp._type == ENEMY_4) ){
				drawImage( main_img[IMAGE_ENEMY_03], tmp._x - 4 + qx, tmp._y - 4 + qy, 32, 32 );
			}
		} else {
			switch( tmp._type ){
			case ENEMY_0:
				if( tmp._attack == RING_RANDOM ){
					tmp._show = drawImage( main_img[IMAGE_ENEMY_00 + _MOD( _elapse, 3 )], tmp._x + qx, tmp._y + qy, 32, 32 );
				} else {
					tmp._show = drawImage( main_img[IMAGE_ENEMY_00 + tmp._attack], tmp._x + qx, tmp._y + qy, 32, 32 );
				}
				break;
			case ENEMY_4:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_40 + _MOD( _elapse, 3 )], tmp._x - 4 + qx, tmp._y - 4 + qy, tmp._w, tmp._w );
				break;
			case ENEMY_1:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_10 + pattern * 2 + _DIV( tmp._pattern, 4 )], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			case ENEMY_2:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_20 + pattern * 5 + tmp._pattern], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
				break;
			case ENEMY_3:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_30 + pattern * 5 + tmp._pattern], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			case ENEMY_5:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_50], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
				break;
			case ENEMY_6:
				tmp._show = drawImage( main_img[IMAGE_ENEMY_60], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			}
		}
	}
	if( dark ){
		drawScaledImage( main_img[IMAGE_LIGHT], _light_x - 200, _light_y - 200, 520, 520, 0, 0, 260, 260 );
		setClip( 0, 0, 216, 216 );
	}
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( tmp._damage >= tmp.m_damage ){
			stage_baku( tmp._x, tmp._y, tmp._w, tmp._elapse );
		} else if( dark ){
			switch( tmp._type ){
			case ENEMY_0:
				if( tmp._attack == RING_RANDOM ){
					tmp._show = drawImage( main_img[IMAGE_ENEMYD_00 + _MOD( _elapse, 3 )], tmp._x + qx, tmp._y + qy, 32, 32 );
				} else {
					tmp._show = drawImage( main_img[IMAGE_ENEMYD_00 + tmp._attack], tmp._x + qx, tmp._y + qy, 32, 32 );
				}
				break;
			case ENEMY_4:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_40 + _MOD( _elapse, 3 )], tmp._x - 4 + qx, tmp._y - 4 + qy, tmp._w, tmp._w );
				break;
			case ENEMY_1:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_10 + _DIV( tmp._pattern, 4 )], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			case ENEMY_2:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_20], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
				break;
			case ENEMY_3:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_30 + tmp._pattern], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			case ENEMY_5:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_50], tmp._x - 4, tmp._y - 4, tmp._w, tmp._w );
				break;
			case ENEMY_6:
				tmp._show = drawImage( main_img[IMAGE_ENEMYD_60], tmp._x, tmp._y, tmp._w, tmp._w );
				break;
			}
		}
	}
	setCMYColor( _MOD( _elapse, 3 ) );
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( (tmp._damage < tmp.m_damage) && (tmp._type == ENEMY_6) && tmp._show ){
			drawLine(
				tmp._x + 12, tmp._y + 12,
				tmp._sx, tmp._sy
				);
		}
	}
}

/**
 * マップ描画
 */
function stage_draw_map( x, y ){
	var i;
	var tmp;
	g.setColor( COLOR_W );
	g.drawRect( x, y, 63, 63 );
	x += 2;
	y += 2;
	g.drawRect( x + _DIV( jiki_x, 16 ), y + _DIV( jiki_y, 16 ), 1, 1 );
	setCMYColor( _MOD( _elapse, 3 ) );
	for( i = enemy_size - 1; i >= 0; i-- ){
		tmp = enemy.elementAt( i );
		if( (tmp._type == ENEMY_0) && (tmp._damage < tmp.m_damage) ){
			g.drawRect( x + _DIV( tmp._x, 16 ), y + _DIV( tmp._y, 16 ), 1, 1 );
		}
	}
}
