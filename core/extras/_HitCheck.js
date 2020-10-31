/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _HitCheck(){
	this.r = 0;
	this.d = 0;
}

_HitCheck.prototype = {

	initCircle : function( r0, r1 ){
		this.r = r0 + r1;
		this.d = this.r * this.r;
	},
	circle : function( cx0, cy0, cx1, cy1 ){
		var w = cx0 - cx1;
		var h = cy0 - cy1;
		return (w * w + h * h <= this.d);
	},

	initCircleAndRect : function( r ){
		this.r = r;
		this.d = this.r * this.r;
	},
	circleAndRect : function( cx, cy, left, top, right, bottom ){
		if( (cx >= left) && (cx <= right) ){
			return ((cy >= top - this.r) && (cy <= bottom + this.r));
		}
		if( (cy >= top) && (cy <= bottom) ){
			return ((cx >= left - this.r) && (cx <= right + this.r));
		}
		if( (cx < left) && (cy < top) ){
			var w = cx - left;
			var h = cy - top;
			return (w * w + h * h <= this.d);
		}
		if( (cx < left) && (cy > bottom) ){
			var w = cx - left;
			var h = cy - bottom;
			return (w * w + h * h <= this.d);
		}
		if( (cx > right) && (cy < top) ){
			var w = cx - right;
			var h = cy - top;
			return (w * w + h * h <= this.d);
		}
		if( (cx > right) && (cy > bottom) ){
			var w = cx - right;
			var h = cy - bottom;
			return (w * w + h * h <= this.d);
		}
		return false;
	},

	rect : function( left0, top0, right0, bottom0, left1, top1, right1, bottom1 ){
		return ((left0 <= right1) && (top0 <= bottom1) && (right0 >= left1) && (bottom0 >= top1));
	}

};
