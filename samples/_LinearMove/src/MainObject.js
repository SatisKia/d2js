#include "extras\_LinearMove.js"

function MainObject( x0, y0, x1, y1, dist ){
	this.m = new _LinearMove();
	this.m.setPos( x0, y0, x1, y1 );
	this.d = dist;
	this.col = getGraphics().getColorOfRGB(
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) )
		);
}

MainObject.prototype.update = function(){
	this.m.update( this.d );
	if(
		(this.m.getX() < 0) || (this.m.getX() >= getWidth ()) ||
		(this.m.getY() < 0) || (this.m.getY() >= getHeight())
	){
		return false;
	}
	return true;
};

MainObject.prototype.draw = function( g ){
	g.setColor( this.col );
	g.fillRect( this.m.getX() - 5, this.m.getY() - 5, 10, 10 );
};
