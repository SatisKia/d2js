#include "Main.h"

function Shot( p1, p2, p3, p4 ){
	this._x0 = p1;
	this._y0 = p2;
	this._x1 = p3;
	this._y1 = p4;
	this._x = this._x0;
	this._y = this._y0;
	this._elapse = 0;
	this._col = -1;
}

Shot.prototype.update = function(){
	this._elapse += SHOT_MOVE;

	var i;
	var e;
	var dx, dy, sx, sy;
	var w, h;
	var d = this._elapse * this._elapse;
	sx = (this._x1 > this._x0) ? 1 : -1;
	dx = (this._x1 > this._x0) ? this._x1 - this._x0 : this._x0 - this._x1;
	sy = (this._y1 > this._y0) ? 1 : -1;
	dy = (this._y1 > this._y0) ? this._y1 - this._y0 : this._y0 - this._y1;
	this._x = this._x0;
	this._y = this._y0;
	if( dx >= dy ){
		e = -dx;
		for( i = 0; i <= this._elapse; i++ ){
			this._x += sx;
			e += 2 * dy;
			if( e >= 0 ){
				this._y += sy;
				e -= 2 * dx;
			}
			w = this._x - this._x0;
			h = this._y - this._y0;
			if( (w * w + h * h) >= d ){
				// 目標距離に達すると抜ける(水平垂直に飛ぶ弾も斜めに飛ぶ弾も速度が一定になる)
				break;
			}
		}
	} else {
		e = -dy;
		for( i = 0; i <= this._elapse; i++ ){
			this._y += sy;
			e += 2 * dx;
			if( e >= 0 ){
				this._x += sx;
				e -= 2 * dy;
			}
			w = this._x - this._x0;
			h = this._y - this._y0;
			if( (w * w + h * h) >= d ){
				// 目標距離に達すると抜ける(水平垂直に飛ぶ弾も斜めに飛ぶ弾も速度が一定になる)
				break;
			}
		}
	}
};
