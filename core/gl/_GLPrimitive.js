/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_GLPrimitive.h"

function _GLPrimitive(){
	this._type = _GLPRIMITIVE_TYPE_MODEL;
	this._depth = false;
	this._trans = 255;
}

_GLPrimitive.prototype = {

	setType : function( type ){
		this._type = type;
	},

	setDepth : function( depth ){
		this._depth = depth;
	},

	setTransparency : function( trans ){
		this._trans = trans;
	},

	type : function(){
		return this._type;
	},

	depth : function(){
		return this._depth;
	},

	transparency : function(){
		return this._trans;
	}

};
