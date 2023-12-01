function MainObject( x, y, dx, dy ){
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.col = getGraphics().getColorOfRGB(
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) ),
		Math.abs( rand.next( 256 ) )
		);
}

MainObject.prototype.update = function(){
	this.x += this.dx;
	if( (this.x < 0) || (this.x >= getWidth()) ){
		playSound();
		this.dx = -this.dx;
	}
	this.y += this.dy;
	if( (this.y < 0) || (this.y >= getHeight()) ){
		playSound();
		this.dy = -this.dy;
	}
};

MainObject.prototype.draw = function( g ){
	g.setColor( this.col );
	g.fillRect( this.x - 5, this.y - 5, 10, 10 );
};
