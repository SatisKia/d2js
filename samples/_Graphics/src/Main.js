#include "_Graphics.js"
#include "_ScalableGraphics.js"
#include "_Image.js"
#include "_Main.js"

var g1, g2;
var img;
var step;
var x, y;
var angle;

function frameTime(){ return 1000 / 15/*フレーム*/; }

function init(){
	_USE_KEY = true;
}

function start(){
	setCurrent( "canvas0" );

	g1 = new _Graphics();
	g2 = new _ScalableGraphics();

	setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );
	g2.setScale( getHeight() / 480 );

	img = loadImage( "00.png" );

	step = 0;
	x = 0;
	y = 0;
	angle = 0;

	setGraphics( g1 );

	return true;
}

function paint( g ){
	switch( step ){
	case 0:
		x++; if( x >= 60 ) step++;
		break;
	case 1:
		y++; if( y >= 60 ) step++;
		break;
	case 2:
		x--; if( x <= 0 ) step++;
		break;
	case 3:
		y--; if( y <= 0 ) step = 0;
		break;
	}

	g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	g.fillRect( 0, 0, 480, 480 );

	g.setAlpha( 192 );

	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.fillRect( 80, 80, 200, 200 );
	g.setColor( g.getColorOfRGB( 0, 255, 0 ) );
	g.fillRect( 160, 160, 200, 200 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.fillRect( 240, 240, 200, 200 );

	g.drawScaledImage( img, 0, 0, 100, 100, x, y, 120, 120 );
	g.setFlipMode( _FLIP_HORIZONTAL );
	g.drawScaledImage( img, 120, 0, 100, 100, x, y, 120, 120 );
	g.setFlipMode( _FLIP_VERTICAL );
	g.drawScaledImage( img, 240, 0, 100, 100, x, y, 120, 120 );
	g.setFlipMode( _FLIP_ROTATE );
	g.drawScaledImage( img, 360, 0, 100, 100, x, y, 120, 120 );
	g.setFlipMode( _FLIP_NONE );

	// drawTransImage() では setFlipMode() が効かないことを示しています
	g.drawTransImage( img, 0, 160, x, y, 120, 120, 0, 120, 45, 100, 100 );
	g.setFlipMode( _FLIP_HORIZONTAL );
	g.drawTransImage( img, 120, 160, x, y, 120, 120, 0, 120, 45, 100, 100 );
	g.setFlipMode( _FLIP_VERTICAL );
	g.drawTransImage( img, 240, 160, x, y, 120, 120, 0, 120, 45, 100, 100 );
	g.setFlipMode( _FLIP_ROTATE );
	g.drawTransImage( img, 360, 160, x, y, 120, 120, 0, 120, 45, 100, 100 );
	g.setFlipMode( _FLIP_NONE );

	// drawTransImage() で反転させるには、拡大率をマイナス値にします
	g.drawTransImage( img, 60, 300, x, y, 120, 120, 60, 60, angle, 150, 100 );
	g.drawTransImage( img, 180, 300, x, y, 120, 120, 60, 60, angle, -100, 150 );
	g.drawTransImage( img, 300, 300, x, y, 120, 120, 60, 60, angle, 150, -100 );
	g.drawTransImage( img, 420, 300, x, y, 120, 120, 60, 60, angle, -100, -150 );
	angle++;

	g.setAlpha( 255 );

	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 50, "ＭＳ Ｐゴシック" );
	g.drawString( (g == g1) ? "_Graphics" : "_ScalableGraphics", 0, 480 );
}

function processEvent( type, param ){
	switch( type ){
	case _KEY_PRESSED_EVENT:
		setGraphics( (getGraphics() == g1) ? g2 : g1 );
		break;
	case _RESIZE_EVENT:
		setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );
		g2.setScale( getHeight() / 480 );
		break;
	}
}

function error(){
	launch( "error.html" );
}
