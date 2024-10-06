/*
 * D2JS
 * Copyright (C) SatisKia. All rights reserved.
 */

function _Vector( len ){
	this.o = new Array( len );
	this.n = 0;
}

_Vector.prototype = {
	size : function(){
		return this.n;
	},
	isEmpty : function(){
		return (this.n == 0);
	},
	elementAt : function( index ){
		return this.o[index];
	},
	firstElement : function(){
		return this.o[0];
	},
	lastElement : function(){
		return this.o[this.n - 1];
	},
	setElementAt : function( obj, index ){
		if( (index >= 0) && (index < this.n) ){
			this.o[index] = obj;
		}
	},
	removeElementAt : function( index ){
		if( (index >= 0) && (index < this.n) ){
			this.o[index] = null;
			for( var i = index; i < this.n - 1; i++ ){
				this.o[i] = this.o[i + 1];
			}
			this.n--;
		}
	},
	insertElementAt : function( obj, index ){
		if( (index >= 0) && (index < this.n) ){
			for( var i = this.n - 1; i >= index; i-- ){
				this.o[i + 1] = this.o[i];
			}
			this.o[index] = obj;
			this.n++;
		}
	},
	addElement : function( obj ){
		this.o[this.n] = obj;
		this.n++;
	},
	removeAllElements : function(){
		for( var i = 0; i < this.n; i++ ){
			this.o[i] = null;
		}
		this.n = 0;
	}
};
