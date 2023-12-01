/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

var _Math = {
	int : function( x ){
		if( x < 0 ){
			return Math.ceil( x );
		}
		return Math.floor( x );
	},
	div : function( a, b ){
		if( a < 0 ){
			return Math.ceil( a / b );
		}
		return Math.floor( a / b );
	},
	mod : function( a, b ){
		if( a < 0 ){
			a = -a;
			return -(a - Math.floor( a / b ) * b);
		}
		return a - Math.floor( a / b ) * b;
	}
};

function _INT( x ){
	return _Math.int( x );
}
function _DIV( a, b ){
	return _Math.div( a, b );
}
function _MOD( a, b ){
	return _Math.mod( a, b );
}
