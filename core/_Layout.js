/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

#include "_Global.h"

function _Layout( src ){
	this.s = src;
	this.o = new Array();
	this.id = -1;
}

_Layout.prototype = {

	clear : function(){
		for( var i = 0; i < this.o.length; i++ ){
			removeButton( this.o[i] );
		}
		this.o = new Array();
	},

	add : function( x, y, width, height, id ){
		this.o[this.o.length] = createButton( _canvas, this.s, x, y, width, height );
		this.o[this.o.length - 1].id = id;
	},
	addArea : function( x, y, width, height, id, areaName, shape, coords ){
		this.o[this.o.length] = createButton( _canvas, this.s, x, y, width, height, areaName, shape, coords );
		this.o[this.o.length - 1].id = id;
	},

	get : function( id ){
		for( var i = 0; i < this.o.length; i++ ){
			if( this.o[i].id == id ){
				return this.o[i];
			}
		}
		return null;
	},

	check : function(){
		return this.id;
	},

	handleEvent : function( type, param ){
		var i;
		switch( type ){
		case _BUTTON_DOWN_EVENT:
			for( i = 0; i < this.o.length; i++ ){
				if( param == buttonElement( this.o[i] ) ){
					processEvent( _LAYOUT_DOWN_EVENT, this.o[i].id );
					break;
				}
			}
			break;
		case _BUTTON_OUT_EVENT:
			for( i = 0; i < this.o.length; i++ ){
				if( param == buttonElement( this.o[i] ) ){
					this.id = -1;
					break;
				}
			}
			break;
		case _BUTTON_OVER_EVENT:
			for( i = 0; i < this.o.length; i++ ){
				if( param == buttonElement( this.o[i] ) ){
					this.id = this.o[i].id;
					break;
				}
			}
			break;
		case _BUTTON_UP_EVENT:
			for( i = 0; i < this.o.length; i++ ){
				if( param == buttonElement( this.o[i] ) ){
					processEvent( _LAYOUT_UP_EVENT, this.o[i].id );
					break;
				}
			}
			break;
		case _RESIZE_EVENT:
			for( i = 0; i < this.o.length; i++ ){
				updateButtonPos( this.o[i] );
			}
			break;
		}
	}

};
