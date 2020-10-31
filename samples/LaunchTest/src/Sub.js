#include "_Graphics.js"
#include "_Main.js"

var step;
var score;

function frameTime(){ return 1000 / 10/*フレーム*/; }

function init(){
	_USE_MOUSE = true;
}

function start(){
	setCurrent( "canvas0" );

	var tmp;

	tmp = getParameter( "step" );
	if( tmp.length == 0 ){
		step = 1;
	} else {
		step = parseInt( tmp );
		step++;
	}

	tmp = getParameter( "score" );
	if( tmp.length == 0 ){
		score = 0;
	} else {
		score = parseInt( tmp );
	}

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 255, 127, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 80, "ＭＳ ゴシック" );

	var tmp = "" + score;
	g.drawString( tmp, getWidth() / 2 - g.stringWidth( tmp ) / 2, getHeight() / 2 + g.fontHeight() / 2 );

	score--;
}

function processEvent( type, param ){
	if( type == _MOUSE_UP_EVENT ){
		launch( "index.html?step=" + step + "&score=" + score );
	}
}

function error(){
	launch( "error.html" );
}
