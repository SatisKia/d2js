#include "_Button.js"
#include "_Graphics.js"
#include "_Main.js"

var button_1;
var button_2;
var button_3;

var img;
var img_select;

var str1;
var str2;

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_TOUCH = true;
}

function start(){
	setCurrent( "canvas0" );

	button_1 = attachButton( getCurrent(), "button0", 20, 20, 120, 120 );
	button_2 = createButton( getCurrent(), "res/rax_button.png", 20, 170, 120, 120 );
	button_3 = createButton( getCurrent(), "res/ray_button.png", 20, 320, 120, 120 );

	img = new Array( 3 );
	img[0] = getResImage( "res_img0" );
	img[1] = getResImage( "res_img1" );
	img[2] = getResImage( "res_img2" );
	img_select = -1;

	str1 = new Array( 3 );
	str1[0] = getResString( "res_str0" );
	str1[1] = getResString( "res_str1" );
	str1[2] = getResString( "res_str2" );

	str2 = "";

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	if( img_select >= 0 ){
		g.drawScaledImage( img[img_select], 160, 0, 480, 480, 0, 0, img[img_select].width, img[img_select].height );
	}

	g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
	g.setFont( 18, "ＭＳ ゴシック" );
	g.drawString( str2, 160, g.fontHeight() );
}

function processEvent( type, param ){
	switch( type ){
	case _BUTTON_DOWN_EVENT:
		if( param == buttonElement( button_1 ) ){
			str2 = "BUTTON " + str1[0] + " DOWN";
			img_select = 0;
		} else if( param == buttonElement( button_2 ) ){
			str2 = "BUTTON " + str1[1] + " DOWN";
			img_select = 1;
		} else if( param == buttonElement( button_3 ) ){
			str2 = "BUTTON " + str1[2] + " DOWN";
			img_select = 2;
		}
		break;
	case _BUTTON_UP_EVENT:
		if( param == buttonElement( button_1 ) ){
			str2 = "BUTTON " + str1[0] + " UP";
		} else if( param == buttonElement( button_2 ) ){
			str2 = "BUTTON " + str1[1] + " UP";
		} else if( param == buttonElement( button_3 ) ){
			str2 = "BUTTON " + str1[2] + " UP";
		}
		break;
	case _BUTTON_OVER_EVENT:
		if( param == buttonElement( button_1 ) ){
			str2 = "BUTTON " + str1[0] + " OVER";
			setButtonPosSize( button_1, 10, 10, 140, 140 );
		} else if( param == buttonElement( button_2 ) ){
			str2 = "BUTTON " + str1[1] + " OVER";
			setButtonPosSize( button_2, 10, 160, 140, 140 );
		} else if( param == buttonElement( button_3 ) ){
			str2 = "BUTTON " + str1[2] + " OVER";
			setButtonPosSize( button_3, 10, 310, 140, 140 );
		}
		break;
	case _BUTTON_OUT_EVENT:
		if( param == buttonElement( button_1 ) ){
			str2 = "BUTTON " + str1[0] + " OUT";
			setButtonPosSize( button_1, 20, 20, 120, 120 );
		} else if( param == buttonElement( button_2 ) ){
			str2 = "BUTTON " + str1[1] + " OUT";
			setButtonPosSize( button_2, 20, 170, 120, 120 );
		} else if( param == buttonElement( button_3 ) ){
			str2 = "BUTTON " + str1[2] + " OUT";
			setButtonPosSize( button_3, 20, 320, 120, 120 );
		}
		break;
	case _RESIZE_EVENT:
		updateButtonPos( button_1 );
		updateButtonPos( button_2 );
		updateButtonPos( button_3 );
		break;
	}
}

function error(){
	launch( "error.html" );
}
