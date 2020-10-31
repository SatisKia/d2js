/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _LockonMove( x0, y0, x1, y1, step, clockwise ){
	this.s = step;
	this.mx = new Array( this.s );
	this.my = new Array( this.s );
	for( var i = 0; i < this.s; i++ ){
		var deg = (360 * i) / this.s;
		this.mx[i] = Math.sin( this.deg2rad( deg         ) ) * 120.0;
		this.my[i] = Math.cos( this.deg2rad( deg + 180.0 ) ) * 120.0;
	}

	this.x = x0;
	this.y = y0;
	this.tx = x1;
	this.ty = y1;
	this.d = this.direction( this.x, this.y, this.tx, this.ty );
	this.c = clockwise;
	this.c2 = false;
}

_LockonMove.prototype = {

	deg2rad : function( angle ){
		return (angle * 3.14159265358979323846264) / 180.0;
	},

	direction : function( x0, y0, x1, y1 ){
		x1 -= x0;
		y1 -= y0;
		var dx = 0;
		var dy = 0;
		var tmp_d = 0;
		var d = 0;
		var j = 0;
		for( var i = 0; i < this.s; i++ ){
			dx = x1 - this.mx[i];
			dy = y1 - this.my[i];
			tmp_d = dx * dx + dy * dy;
			if( (i == 0) || (tmp_d < d) ){
				d = tmp_d;
				j = i;
			}
		}
		return j;
	},
	normalizeX : function( direction ){
		if( direction < 0 ){
			direction += this.s;
		} else if( direction >= this.s ){
			direction -= this.s;
		}
		return this.mx[direction] / 120.0;
	},
	normalizeY : function( direction ){
		if( direction < 0 ){
			direction += this.s;
		} else if( direction >= this.s ){
			direction -= this.s;
		}
		return this.my[direction] / 120.0;
	},

	addDirection : function( add ){
		this.d += add;
		if( this.d < 0 ){
			this.d += this.s;
		} else if( this.d >= this.s ){
			this.d -= this.s;
		}
	},

	setTarget : function( tx, ty ){
		this.tx = tx;
		this.ty = ty;
	},

	update : function( dist, step ){
		this.x += this.mx[this.d] * dist / 120.0;
		this.y += this.my[this.d] * dist / 120.0;
		var tmp = this.direction( this.x, this.y, this.tx, this.ty );
		if( Math.abs( this.d - tmp ) == Math.floor( this.s / 2 ) ){
			if( !this.c2 ){
				this.c = this.c ? false : true;
				this.c2 = true;
			}
			if( this.c ){
				step = 0 - step;
			}
		} else {
			this.c2 = false;
			if(
				((tmp >  this.d) && ((tmp - this.d) >= Math.floor( this.s / 2 ))) ||
				((tmp <= this.d) && ((this.d - tmp) <  Math.floor( this.s / 2 )))
			){
				step = 0 - step;
			}
		}
		this.d = ((this.d + step) + this.s) % this.s;
	},

	getX : function(){
		return this.x;
	},
	getY : function(){
		return this.y;
	},
	getDirection : function(){
		return this.d;
	}

};
