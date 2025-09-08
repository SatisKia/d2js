/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

window._GESTURE_PINCH_EVENT  = 0;
window._GESTURE_ROTATE_EVENT = 1;

function _Gesture(){
	this._ax = 0;
	this._ay = 0;
	this._bx = 0;
	this._by = 0;
	this._cx = 0;
	this._cy = 0;
	this._len = 0.0;
	this._angle = 0.0;
}

_Gesture.prototype = {

	// ベクトルの長さ
	_getVectorLength : function( vx, vy ){
		return Math.sqrt( (vx * vx) + (vy * vy) );
	},

	// ベクトルの内積
	_dotProduct : function( vx1, vy1, vx2, vy2 ){
		return vx1 * vx2 + vy1 * vy2;
	},

	_getAngle : function( ax, ay, bx, by ){
		var a = this._getVectorLength( ax, ay );
		var b = this._getVectorLength( bx, by );
		return Math.acos( this._dotProduct( ax, ay, bx, by ) / (a * b) );
	},

	start : function( ax, ay, bx, by ){
		this._ax = ax;
		this._ay = ay;
		this._bx = bx;
		this._by = by;
		this._cx = (ax + bx) / 2;
		this._cy = (ay + by) / 2;
		this._len = this._getVectorLength( bx - ax, by - ay );
		this._angle = this._getAngle( ax, ay, bx, by );
	},

	pinch : function( ax, ay, bx, by ){
		if( this._ax != ax || this._ay != ay || this._bx != bx || this._by != by ){
			this._ax = ax;
			this._ay = ay;
			this._bx = bx;
			this._by = by;
			var len = this._getVectorLength( bx - ax, by - ay );
			processGestureEvent( window._GESTURE_PINCH_EVENT, len / this._len );
		}
	},

	rotate : function( ax, ay, bx, by ){
		if( this._ax != ax || this._ay != ay || this._bx != bx || this._by != by ){
			this._ax = ax;
			this._ay = ay;
			this._bx = bx;
			this._by = by;
			var angle = this._getAngle( ax, ay, bx, by );
			processGestureEvent( window._GESTURE_ROTATE_EVENT, angle - this._angle );
		}
	},

	centerX : function(){
		return this._cx;
	},
	centerY : function(){
		return this._cy;
	}

};

//function processGestureEvent( type, param ){}
