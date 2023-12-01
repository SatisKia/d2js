#include "_Graphics.js"
#include "_Main.js"
#include "_Random.js"
#include "_Vector.js"

#include "MainObject.js"

var rand;
var object;

var _elapse;	// 経過時間
var _time;		//

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_KEY = true;
	_USE_MOUSE = true;
	_USE_REQUESTANIMATIONFRAME = true;
}

function start(){
	setCurrent( "canvas0" );

	rand = new _Random();
	object = new _Vector( 128 );

	_elapse = 0;
	_time = currentTimeMillis();

	return true;
}

function paint( g ){
	var i;
	var tmp;

	for( i = object.size() - 1; i >= 0; i-- ){
		tmp = object.elementAt( i );
		if( !(tmp.update( getMouseX(), getMouseY(), ((_elapse % 5) == 0) ? true : false )) ){
			object.removeElementAt( i );
		}
	}

	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );
	for( i = 0; i < object.size(); i++ ){
		tmp = object.elementAt( i );
		tmp.draw( g );
	}
	g.setColor( g.getColorOfRGB( 255, 0, 0 ) );
	g.setFont( 24, "ＭＳ ゴシック" );
	g.drawString( "" + ((_elapse + 1) * 1000 / (currentTimeMillis() - _time)), 0, g.fontHeight() );
	g.drawString( "" + object.size(), 0, g.fontHeight() * 2 );

	_elapse++;
}

function processEvent( type, param ){
	switch( type ){
	case _KEY_PRESSED_EVENT:
		object.addElement( new MainObject(
			getWidth () / 2,
			getHeight() / 2,
//			getWidth () / 2 + (rand.nextInt() % 100),
//			getHeight() / 2 + (rand.nextInt() % 100),
			getWidth () / 2 - (getMouseX() - getWidth () / 2),
			getHeight() / 2 - (getMouseY() - getHeight() / 2),
			(rand.nextInt() > 0) ? true : false,
			Math.abs( rand.nextInt() % 10 ) + 1
			) );
		break;
	}
}

function error(){
	launch( "error.html" );
}
