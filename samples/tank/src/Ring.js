#include "Main.h"

function Ring( p1, p2, p3 ){
	this._x = p1;
	this._y = p2;
	this._col = p3;
	this._elapse = 0;
}

Ring.prototype.update = function(){ this._elapse++; };
