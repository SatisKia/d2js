/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

//TODOメモ
// pinch in：ピンチ・イン（→ ←）
// pinch out：ピンチ・アウト（← →）
// rotate：angle（ラジアン）を返す。時計回りがプラス値

function _Gesture(){
}

_Gesture.prototype = {

	// ベクトルの長さ
	getVectorLength : function( vx, vy ){
		return Math.sqrt( (vx * vx) + (vy * vy) );
	},

	// ベクトルの内積
	dotProduct : function( vx1, vy1, vx2, vy2 ){
		return vx1 * vx2 + vy1 * vy2;
	},

	getAngle : function( ax, ay, bx, by ){
		var a = getVectorLength( ax, ay );
		var b = getVectorLength( bx, by );
		return Math.acos( dotProduct( ax, ay, bx, by ) / (a * b) );
	}

};
