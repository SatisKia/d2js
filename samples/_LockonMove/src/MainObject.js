#include "extras\_LockonMove.js"

function MainObject( x0, y0, x1, y1, clockwise, dist ){
	this.m = new _LockonMove( x0, y0, x1, y1, 16, clockwise );
	this.d = dist;
	this.col = g.getColorOfRGB(
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) )
		);
	this.e = 0;
}

MainObject.prototype.update = function( tx, ty, step ){
	this.e++;
	if( this.e >= 150 ){
		if(
			(this.m.getX() < 0) || (this.m.getX() >= getWidth ()) ||
			(this.m.getY() < 0) || (this.m.getY() >= getHeight())
		){
			return false;
		}
		step = 0;
	}
	this.m.setTarget( tx, ty );
	this.m.update( this.d, step );
	return true;
};

MainObject.prototype.draw = function(){
	g.setColor( this.col );
	if( this.e < 150 ){
		g.fillRect( this.m.getX() - 5, this.m.getY() - 5, 10, 10 );
		var d = this.m.getDirection();
		var x = this.m.getX() + this.m.normalizeX( d ) * 20.0;
		var y = this.m.getY() + this.m.normalizeY( d ) * 20.0;
		var x2 = x + this.m.normalizeX( d - 7 ) * 10.0;
		var y2 = y + this.m.normalizeY( d - 7 ) * 10.0;
		var x3 = x + this.m.normalizeX( d + 7 ) * 10.0;
		var y3 = y + this.m.normalizeY( d + 7 ) * 10.0;
		g.drawLine( this.m.getX(), this.m.getY(), x, y );
		g.drawLine( x, y, x2, y2 );
		g.drawLine( x, y, x3, y3 );
	} else {
		g.drawRect( this.m.getX() - 5, this.m.getY() - 5, 9, 9 );
	}
};
