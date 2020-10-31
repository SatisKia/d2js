#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"

var LAYOUT_1 = 10;
var LAYOUT_2 = 20;
var LAYOUT_3 = 30;

var button_img1;
var button_img2;
var button_img3;

var img;
var img_select;

var str1;
var str2;

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
	_USE_LAYOUTTOUCH = true;
}

function start(){
	setCurrent( "canvas0" );

	addLayout( 20,  20, 120, 120, LAYOUT_1 );
	addLayout( 20, 170, 120, 120, LAYOUT_2 );
	addLayout( 20, 320, 120, 120, LAYOUT_3 );

	button_img1 = loadImage( "res/com_button.png" );
	button_img2 = loadImage( "res/rax_button.png" );
	button_img3 = loadImage( "res/ray_button.png" );

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

	var id = checkLayout( getTouchX( 0 ), getTouchY( 0 ) );
	var tmp;
	if( (tmp = getLayout( LAYOUT_1 )) != null ){
		if( tmp.id == id ){
			g.drawScaledImage( button_img1,
				tmp.x - 10, tmp.y - 10, tmp.width + 20, tmp.height + 20,
				0, 0, button_img1.width, button_img1.height );
		} else {
			g.drawScaledImage( button_img1,
				tmp.x, tmp.y, tmp.width, tmp.height,
				0, 0, button_img1.width, button_img1.height );
		}
	}
	if( (tmp = getLayout( LAYOUT_2 )) != null ){
		if( tmp.id == id ){
			g.drawScaledImage( button_img2,
				tmp.x - 10, tmp.y - 10, tmp.width + 20, tmp.height + 20,
				0, 0, button_img2.width, button_img2.height );
		} else {
			g.drawScaledImage( button_img2,
				tmp.x, tmp.y, tmp.width, tmp.height,
				0, 0, button_img2.width, button_img2.height );
		}
	}
	if( (tmp = getLayout( LAYOUT_3 )) != null ){
		if( tmp.id == id ){
			g.drawScaledImage( button_img3,
				tmp.x - 10, tmp.y - 10, tmp.width + 20, tmp.height + 20,
				0, 0, button_img3.width, button_img3.height );
		} else {
			g.drawScaledImage( button_img3,
				tmp.x, tmp.y, tmp.width, tmp.height,
				0, 0, button_img3.width, button_img3.height );
		}
	}

	if( img_select >= 0 ){
		g.drawScaledImage( img[img_select], 160, 0, 480, 480, 0, 0, img[img_select].width, img[img_select].height );
	}

	g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
	g.setFont( 18, "ＭＳ ゴシック" );
	g.drawString( str2, 160, g.fontHeight() );
}

function processEvent( type, param ){
	switch( type ){
	case _LAYOUT_DOWN_EVENT:
		if( param == 10 ){
			str2 = "LAYOUT " + str1[0] + " DOWN";
			img_select = 0;
		} else if( param == 20 ){
			str2 = "LAYOUT " + str1[1] + " DOWN";
			img_select = 1;
		} else if( param == 30 ){
			str2 = "LAYOUT " + str1[2] + " DOWN";
			img_select = 2;
		}
		break;
	case _LAYOUT_UP_EVENT:
		if( param == 10 ){
			str2 = "LAYOUT " + str1[0] + " UP";
		} else if( param == 20 ){
			str2 = "LAYOUT " + str1[1] + " UP";
		} else if( param == 30 ){
			str2 = "LAYOUT " + str1[2] + " UP";
		}
		break;
	}
}

function error(){
	launch( "error.html" );
}
