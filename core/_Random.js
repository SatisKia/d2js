/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _Random(){
}

_Random.prototype = {
	next : function( n ){
		if( Math.random() < 0.5 ){
			return -Math.floor( Math.random() * n );
		}
		return Math.floor( Math.random() * n );
	},
	nextInt : function(){
		if( Math.random() < 0.5 ){
			return -Math.floor( Math.random() * 0x80000000 );
		}
		return Math.floor( Math.random() * 0x80000000 );
	}
};
