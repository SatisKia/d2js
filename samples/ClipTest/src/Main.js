#include "_Graphics.js"
#include "_Main.js"

var c;

function frameTime(){ return 1000 / 30/*フレーム*/; }

function start(){
	setCurrent( "canvas0" );

	c = getCurrentContext();

	addLayoutArea( 100, 100, 100, 100, 0, "rect"  , "0,0,99,99" );
	addLayoutArea( 300, 100, 100, 100, 1, "circle", "50,50,50" );
	addLayoutArea( 100, 300, 100, 100, 2, "poly"  , "50,0,100,100,0,100" );

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setClip( 120, 130, getWidth() - 300, getHeight() - 230 );

	g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );

	c.beginPath();
	c.moveTo( 100 + 0.5, 100 + 0.5 );
	c.lineTo( 199 + 0.5, 100 + 0.5 );
	c.lineTo( 199 + 0.5, 199 + 0.5 );
	c.lineTo( 100 + 0.5, 199 + 0.5 );
	c.closePath();
	c.fill();

	c.beginPath();
	c.arc( 350, 150, 50, 0, Math.PI * 2.0, false );
	c.fill();

	c.beginPath();
	c.moveTo( 150 + 0.5, 300 + 0.5 );
	c.lineTo( 200 + 0.5, 400 + 0.5 );
	c.lineTo( 100 + 0.5, 400 + 0.5 );
	c.closePath();
	c.fill();

	g.clearClip();

	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );

	c.beginPath();
	c.moveTo( 100 + 0.5, 100 + 0.5 );
	c.lineTo( 199 + 0.5, 100 + 0.5 );
	c.lineTo( 199 + 0.5, 199 + 0.5 );
	c.lineTo( 100 + 0.5, 199 + 0.5 );
	c.closePath();
	c.stroke();

	c.beginPath();
	c.arc( 350, 150, 50, 0, Math.PI * 2.0, false );
	c.stroke();

	c.beginPath();
	c.moveTo( 150 + 0.5, 300 + 0.5 );
	c.lineTo( 200 + 0.5, 400 + 0.5 );
	c.lineTo( 100 + 0.5, 400 + 0.5 );
	c.closePath();
	c.stroke();

	g.setFont( 16, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "" + getMouseX() + " " + getMouseY(), 0, 20 );
	var id = checkLayout( getMouseX(), getMouseY() );
	if( id >= 0 ){
		switch( id ){
		case 0: g.drawString( "RECT"  , 0, 40 ); break;
		case 1: g.drawString( "CIRCLE", 0, 40 ); break;
		case 2: g.drawString( "POLY"  , 0, 40 ); break;
		}
	}
}

function processEvent( type, param ){
}

function error(){
	launch( "error.html" );
}
