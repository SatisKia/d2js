#include "_Graphics.js"
#include "_Main.js"
#include "_Math.js"

var h;
var gamepad;
var event;

function frameTime(){ return 1000 / 30/*フレーム*/; }

function init(){
}

function start( g ){
	setCurrent( "canvas0" );

	setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );

	var g = new _Graphics();
	g.setFont( 16, "ＭＳ ゴシック" );
	h = g.fontHeight();

	gamepad = new _Gamepad();
	gamepad.setTolerance( 0.05, 1.0 );

	event = new Array( 20 );
	for( var i = 0; i < 20; i++ ){
		event[i] = "";
	}

	return true;
}

function paint( g ){
	var i, j;
	var ii;

	g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 16, "ＭＳ ゴシック" );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );

	if( canUseGamepad() ){
		g.drawString( "Gamepad API : true", 0, h );
		if( gamepad.fetch( 0 ) == null ){
			g.drawString( "gamepad : disconnected", 0, h * 3 );
		} else {
			g.drawString( "gamepad : connected", 0, h * 3 );
			g.drawString( "id : " + gamepad.id(), 0, h * 4 );

			g.drawString( "axis", 0, h * 6 );
			g.drawString( "value", 0, h * 7 );
			for( i = 0; i < gamepad.axisNum(); i++ ){
				g.drawString( "" + i, 80 + 60 * i, h * 6 );
				g.drawString( "" + (Math.floor( gamepad.axisValue( i ) * 100 ) / 100), 80 + 60 * i, h * 7 );
			}

			for( j = 0; j <= _DIV( gamepad.buttonNum() - 1, 8 ); j++ ){
				g.drawString( "button", 0, h * (9 + j * 6) );
				g.drawString( "pressed", 0, h * (10 + j * 6) );
				g.drawString( "touched", 0, h * (11 + j * 6) );
				g.drawString( "value", 0, h * (12 + j * 6) );
				g.drawString( "event", 0, h * (13 + j * 6) );
				for( i = 0; i < 8; i++ ){
					ii = j * 8 + i;
					if( ii < gamepad.buttonNum() ){
						g.drawString( "" + ii, 80 + 60 * i, h * (9 + j * 6) );
						g.drawString( "" + (gamepad.isButtonPressed( ii ) ? "true" : "false"), 80 + 60 * i, h * (10 + j * 6) );
						g.drawString( "" + (gamepad.isButtonTouched( ii ) ? "true" : "false"), 80 + 60 * i, h * (11 + j * 6) );
						g.drawString( "" + (Math.floor( gamepad.buttonValue( ii ) * 100 ) / 100), 80 + 60 * i, h * (12 + j * 6) );
						g.drawString( "" + event[ii], 80 + 60 * i, h * (13 + j * 6) );
						event[ii] = "";
					}
				}
			}
		}
	} else {
		g.drawString( "Gamepad API : false", 0, h );
	}
}

function processEvent( type, param ){
	switch( type ){
	case _RESIZE_EVENT:
		setCanvasSize( getBrowserWidth() - 30, getBrowserHeight() - 30 );
		break;
	}
}

function processGamepadEvent( type, id, param ){
	switch( type ){
	case _GAMEPAD_BUTTON_PRESSED_EVENT:
		event[param] = "pressed";
		break;
	case _GAMEPAD_BUTTON_RELEASED_EVENT:
		event[param] = "released";
		break;
	}
}

function error(){
	launch( "error.html" );
}
