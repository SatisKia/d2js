/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _LinearMove(){
	this.x = 0;
	this.y = 0;
	this.x0 = 0;
	this.y0 = 0;
	this.x1 = 0;
	this.y1 = 0;
	this.d = 0.0;
}

_LinearMove.prototype = {

	setPos : function( x0, y0, x1, y1 ){
		this.x0 = x0;
		this.y0 = y0;
		this.x1 = x1;
		this.y1 = y1;
		this.d = 0.0;
		this.x = this.x0;
		this.y = this.y0;
	},

	update : function( dist ){
		this.d += dist;
		var i;
		var e;
		var dx, dy, sx, sy;
		var w, h;
		var d = this.d;
		var d2 = this.d * this.d;
		sx = (this.x1 > this.x0) ? 1 : -1;
		dx = (this.x1 > this.x0) ? this.x1 - this.x0 : this.x0 - this.x1;
		sy = (this.y1 > this.y0) ? 1 : -1;
		dy = (this.y1 > this.y0) ? this.y1 - this.y0 : this.y0 - this.y1;
		this.x = this.x0;
		this.y = this.y0;
		if( dx >= dy ){
			e = -dx;
			for( i = 0; i <= d; i++ ){
				this.x += sx;
				e += 2 * dy;
				if( e >= 0 ){
					this.y += sy;
					e -= 2 * dx;
				}
				w = this.x - this.x0;
				h = this.y - this.y0;
				if( (w * w + h * h) >= d2 ){
					// 目標距離に達すると抜ける
					break;
				}
			}
		} else {
			e = -dy;
			for( i = 0; i <= d; i++ ){
				this.y += sy;
				e += 2 * dx;
				if( e >= 0 ){
					this.x += sx;
					e -= 2 * dy;
				}
				w = this.x - this.x0;
				h = this.y - this.y0;
				if( (w * w + h * h) >= d2 ){
					// 目標距離に達すると抜ける
					break;
				}
			}
		}
	},

	getX : function(){
		return this.x;
	},
	getY : function(){
		return this.y;
	}

};
