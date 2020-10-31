#include "Main.h"

function Enemy( x, y, type, interval, shed, damage ){
	this._type = 0;
	this._attack = 0;
	this._w = 0;
	if( type < 4 ){
		this._type = ENEMY_0;
		this._attack = type;
		this._w = 32;
	} else {
		switch( _DIV( type - 4, 4 ) ){
		case 0: this._type = ENEMY_1; this._attack = SHOT_DIRECTION; this._w = 26; break;
		case 1: this._type = ENEMY_2; this._attack = SHOT_TARGET   ; this._w = 34; break;
		case 2: this._type = ENEMY_3; this._attack = SHOT_TARGET   ; this._w = 26; break;
		case 3: this._type = ENEMY_4; this._attack = SHOT_CIRCLE   ; this._w = 32; break;
		case 4: this._type = ENEMY_5; this._attack = SHOT_CIRCLE   ; this._w = 34; break;
		case 5: this._type = ENEMY_6; this._attack = TOUCH         ; this._w = 26; break;
		}
	}

	this._x        = x;
	this._y        = y;
	this._elapse   = 0;
	this._col      = -1;
	this._tx       = 0;
	this._ty       = 0;
	this._sx       = 0;
	this._sy       = 0;
	this._interval = interval;
	this._shed     = shed;
	this._damage   = 0;
	this.m_damage  = damage;

	this._direction = 0;
	this._pattern = 0;
	switch( this._type ){
	case ENEMY_1:
	case ENEMY_2:
	case ENEMY_3:
		switch( _MOD( type - 4, 4 ) ){
		case 0: this._direction = DIRECTION_D; this._pattern = 0; break;
		case 1: this._direction = DIRECTION_L; this._pattern = 4; break;
		case 2: this._direction = DIRECTION_R; this._pattern = 4; break;
		case 3: this._direction = DIRECTION_U; this._pattern = 0; break;
		}
		break;
	case ENEMY_5:
		this._pattern = 0;
		switch( _MOD( type - 4, 4 ) ){
		case 0: this._direction = DIRECTION_LD; break;
		case 1: this._direction = DIRECTION_LU; break;
		case 2: this._direction = DIRECTION_RD; break;
		case 3: this._direction = DIRECTION_RU; break;
		}
		break;
	case ENEMY_6:
		this._pattern = 0;
		break;
	}

	this._show = false;
}

Enemy.prototype.move = function( w, target ){
	if( target ){
		var cx = this._x;
		var cy = this._y;
		var i;
		var e;
		var dx, dy, sx, sy;
		var w2 = 0;
		var h = 0;
		var d = w * w;
		sx = (this._tx > cx) ? 1 : -1;
		dx = (this._tx > cx) ? this._tx - cx : cx - this._tx;
		sy = (this._ty > cy) ? 1 : -1;
		dy = (this._ty > cy) ? this._ty - cy : cy - this._ty;
		this._x = cx;
		this._y = cy;
		if( dx >= dy ){
			e = -dx;
			for( i = 0; i <= w; i++ ){
				this._x += sx;
				e += 2 * dy;
				if( e >= 0 ){
					this._y += sy;
					e -= 2 * dx;
				}
				w2 = this._x - cx;
				h = this._y - cy;
				if( (w2 * w2 + h * h) >= d ){
					// 目標距離に達すると抜ける
					break;
				}
			}
		} else {
			e = -dy;
			for( i = 0; i <= w; i++ ){
				this._y += sy;
				e += 2 * dx;
				if( e >= 0 ){
					this._x += sx;
					e -= 2 * dy;
				}
				w2 = this._x - cx;
				h = this._y - cy;
				if( (w2 * w2 + h * h) >= d ){
					// 目標距離に達すると抜ける
					break;
				}
			}
		}
		this._tx += w2;
		this._ty += h;
	} else {
		switch( this._direction ){
		case DIRECTION_D : this._y += w; this._pattern--; if( this._pattern < 0 ) this._pattern = 0; break;
		case DIRECTION_L : this._x -= w; this._pattern++; if( this._pattern > 4 ) this._pattern = 4; break;
		case DIRECTION_R : this._x += w; this._pattern++; if( this._pattern > 4 ) this._pattern = 4; break;
		case DIRECTION_U : this._y -= w; this._pattern--; if( this._pattern < 0 ) this._pattern = 0; break;
		case DIRECTION_LD: this._x -= w; this._y += w; break;
		case DIRECTION_LU: this._x -= w; this._y -= w; break;
		case DIRECTION_RD: this._x += w; this._y += w; break;
		case DIRECTION_RU: this._x += w; this._y -= w; break;
		}
	}
};

Enemy.prototype.spear = function(){
	var x0 = this._x + 12;
	var y0 = this._y + 12;
	var x1 = jiki_x + 12;
	var y1 = jiki_y + 12;

	var i;
	var e;
	var dx, dy, sx, sy;
	var w, h;
	var d = 20 * 20;
	sx = (x1 > x0) ? 1 : -1;
	dx = (x1 > x0) ? x1 - x0 : x0 - x1;
	sy = (y1 > y0) ? 1 : -1;
	dy = (y1 > y0) ? y1 - y0 : y0 - y1;
	this._sx = x0;
	this._sy = y0;
	if( dx >= dy ){
		e = -dx;
		for( i = 0; i <= 20; i++ ){
			this._sx += sx;
			e += 2 * dy;
			if( e >= 0 ){
				this._sy += sy;
				e -= 2 * dx;
			}
			w = this._sx - x0;
			h = this._sy - y0;
			if( (w * w + h * h) >= d ){
				// 目標距離に達すると抜ける
				break;
			}
		}
	} else {
		e = -dy;
		for( i = 0; i <= 20; i++ ){
			this._sy += sy;
			e += 2 * dx;
			if( e >= 0 ){
				this._sx += sx;
				e -= 2 * dy;
			}
			w = this._sx - x0;
			h = this._sy - y0;
			if( (w * w + h * h) >= d ){
				// 目標距離に達すると抜ける
				break;
			}
		}
	}
};

Enemy.prototype.update = function( stage_clear ){
	if( this._damage >= this.m_damage ){
		// 時間だけは経過させる
		this._elapse++;
	} else if( !stage_clear ){
		// 移動する
		if(
			(this._type != ENEMY_0) && (this._type != ENEMY_4) &&
			(this._x >= _win_x - 132) && (this._x <= _win_x + 324) &&
			(this._y >= _win_y - 132) && (this._y <= _win_y + 324)
		){
			var old_x = this._x;
			var old_y = this._y;
			switch( this._type ){
			case ENEMY_1: this.move( ENEMY_MOVE1, false ); break;
			case ENEMY_2: this.move( ENEMY_MOVE2, false ); break;
			case ENEMY_3:
				if( _MOD( this._elapse, 15 ) == 0 ){
					if( Math.abs( this._x - jiki_x ) > Math.abs( this._y - jiki_y ) ){
						if( this._x > jiki_x ) this._direction = DIRECTION_L; else this._direction = DIRECTION_R;
					} else {
						if( this._y > jiki_y ) this._direction = DIRECTION_U; else this._direction = DIRECTION_D;
					}
				}
				this.move( ENEMY_MOVE3, false );
				break;
			case ENEMY_5:
				if( _MOD( this._elapse, 15 ) == 0 ){
					switch( this._direction ){
					case DIRECTION_LD:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LU; break;
						case  0: this._direction = DIRECTION_RD; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_LU:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_RD; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_RD:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_LU; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_RU:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_LU; break;
						case  1: this._direction = DIRECTION_RD; break;
						}
						break;
					}
					break;
				}
				this.move( ENEMY_MOVE3, false );
				break;
			case ENEMY_6:
				if( _MOD( this._elapse, 5 ) == 0 ){
					this._tx = jiki_x;
					this._ty = jiki_y;
				}
				this.move( ENEMY_MOVE3, true );
				break;
			}
			if( stage_hit( this._x, this._y ) == BASE_KABE ){
				// 元の位置に戻す
				this._x = old_x;
				this._y = old_y;

				// 方向転換
				switch( this._type ){
				case ENEMY_1:
					switch( this._direction ){
					case DIRECTION_D: this._direction = DIRECTION_U; break;
					case DIRECTION_L: this._direction = DIRECTION_R; break;
					case DIRECTION_R: this._direction = DIRECTION_L; break;
					case DIRECTION_U: this._direction = DIRECTION_D; break;
					}
					break;
				case ENEMY_2:
				case ENEMY_3:
					switch( this._direction ){
					case DIRECTION_D:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_L; break;
						case  0: this._direction = DIRECTION_R; break;
						case  1: this._direction = DIRECTION_U; break;
						}
						break;
					case DIRECTION_L:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_D; break;
						case  0: this._direction = DIRECTION_R; break;
						case  1: this._direction = DIRECTION_U; break;
						}
						break;
					case DIRECTION_R:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_D; break;
						case  0: this._direction = DIRECTION_L; break;
						case  1: this._direction = DIRECTION_U; break;
						}
						break;
					case DIRECTION_U:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_D; break;
						case  0: this._direction = DIRECTION_L; break;
						case  1: this._direction = DIRECTION_R; break;
						}
						break;
					}
					break;
				case ENEMY_5:
					switch( this._direction ){
					case DIRECTION_LD:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LU; break;
						case  0: this._direction = DIRECTION_RD; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_LU:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_RD; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_RD:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_LU; break;
						case  1: this._direction = DIRECTION_RU; break;
						}
						break;
					case DIRECTION_RU:
						switch( rand.next( 2 ) ){
						case -1: this._direction = DIRECTION_LD; break;
						case  0: this._direction = DIRECTION_LU; break;
						case  1: this._direction = DIRECTION_RD; break;
						}
						break;
					}
					break;
				case ENEMY_6:
					switch( rand.next( 3 ) ){
					case -2: this._tx = this._x - 960; this._ty = this._y; break;
					case -1: this._tx = this._x + 960; this._ty = this._y; break;
					case  0: this._tx = this._x + (this._x - jiki_x); this._ty = this._y + (this._y - jiki_y); break;
					case  1: this._tx = this._x; this._ty = this._y - 960; break;
					case  2: this._tx = this._x; this._ty = this._y + 960; break;
					}
					break;
				}
			}
			if( this._type == ENEMY_6 ){
				this.spear();
			}
		}

		// 攻撃する
		if(
			(_MOD( this._elapse, this._interval ) == this._shed) &&
			(this._x >= _win_x - 132) && (this._x <= _win_x + 324) &&
			(this._y >= _win_y - 132) && (this._y <= _win_y + 324)
		){
			switch( this._attack ){
			case RING_C:
			case RING_M:
			case RING_Y:
				ring.addElement( new Ring( _DIV( this._x, 12 ) + 1, _DIV( this._y, 12 ) + 1, this._attack ) );
play_sound( SE_WAVE );
				break;
			case RING_RANDOM:
				{
					var tmp = rand.next( 2 ) + 1;
					if( tmp == this._col ){
						tmp++; if( tmp > 2 ) tmp = 0;
					}
					this._col = tmp;
					ring.addElement( new Ring( _DIV( this._x, 12 ) + 1, _DIV( this._y, 12 ) + 1, tmp ) );
play_sound( SE_WAVE );
				}
				break;
			case SHOT_DIRECTION:
				switch  ( this._direction ){
				case DIRECTION_D: shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8, 960 ) ); break;
				case DIRECTION_L: shot.addElement( new Shot( this._x + 8, this._y + 8,   0, this._y + 8 ) ); break;
				case DIRECTION_R: shot.addElement( new Shot( this._x + 8, this._y + 8, 960, this._y + 8 ) ); break;
				case DIRECTION_U: shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8,   0 ) ); break;
				}
play_sound( SE_SHOT );
				break;
			case SHOT_TARGET:
				shot.addElement( new Shot( this._x + 8, this._y + 8, jiki_x + 8, jiki_y + 8 ) );
play_sound( SE_SHOT );
				break;
			case SHOT_CIRCLE:
				{
					var i;
					for( i = 0; i < 12; i++ ){
						shot.addElement( new Shot( this._x + 8, this._y + 8, this._x + 8 + COS[i], this._y + 8 + SIN[i] ) );
					}
play_sound( SE_SHOT );
				}
				break;
			}
		}

		this._elapse++;
	}
};
