#include "_Graphics.js"
#include "_Image.js"
#include "_Main.js"

var img;
var str;

var http_request_1;
var http_request_2;
var http_request_3;

function frameTime(){ return 1000 / 60/*フレーム*/; }

function init(){
}

function start(){
	var i, j;

	setCurrent( "canvas0" );

	for( i = 0; i < 3; i++ ){
		switch( i ){
		case 0: id = "get" ; break;
		case 1: id = "post"; break;
		case 2: id = "json"; break;
		}
		for( j = 0; j < 4; j++ ){
			addEventListener( document.getElementById( id + j ), "mousedown", imgMouseDown );
			addEventListener( document.getElementById( id + j ), "mouseup"  , imgMouseUp   );
			addEventListener( document.getElementById( id + j ), "mouseover", imgMouseOver );
			addEventListener( document.getElementById( id + j ), "mouseout" , imgMouseOut  );
		}
	}

	img = loadImage( "error.jpg" );

	str = new Array( 5 );
	for( i = 0; i < 5; i++ ){
		str[i] = "";
	}

	http_request_1 = null;
	http_request_2 = null;
	http_request_3 = null;

	return true;
}

function imgMouseDown( e ){
	str[0] = e.target.id + " MOUSE DOWN";
	if(
		(http_request_1 != null) ||
		(http_request_2 != null) ||
		(http_request_3 != null)
	){
		return;
	}
	var character = "ダミー";
	if( (e.target.id === "get0") || (e.target.id === "post0") || (e.target.id === "json0") ){
		character = "こむ";
	}
	if( (e.target.id === "get1") || (e.target.id === "post1") || (e.target.id === "json1") ){
		character = "ラクス";
	}
	if( (e.target.id === "get2") || (e.target.id === "post2") || (e.target.id === "json2") ){
		character = "レイ";
	}
	if( (e.target.id === "get0") || (e.target.id === "get1") || (e.target.id === "get2") || (e.target.id === "get3") ){
		str[1] = SERVER + "test1.php?character=" + encodeURIComponent( character );
		http_request_1 = httpGet( str[1] );
	}
	if( (e.target.id === "post0") || (e.target.id === "post1") || (e.target.id === "post2") || (e.target.id === "post3") ){
		str[1] = "character=" + encodeURIComponent( character );
		http_request_2 = httpPost( SERVER + "test2.php", str[1], "application/x-www-form-urlencoded" );
	}
	if( (e.target.id === "json0") || (e.target.id === "json1") || (e.target.id === "json2") || (e.target.id === "json3") ){
		jsonInit();
		jsonAddString( "character", character );
		str[1] = jsonOut();
		http_request_3 = httpPost( SERVER + "test3.php", str[1], "application/json" );
	}
}
function imgMouseUp( e ){
	str[0] = e.target.id + " MOUSE UP";
}
function imgMouseOver( e ){
	str[0] = e.target.id + " MOUSE OVER";
}
function imgMouseOut( e ){
	str[0] = e.target.id + " MOUSE OUT";
}

function onHttpSetRequestHeader( header, value ){
}

function onHttpResponse( request, data ){
	str[2] = data;
	if( request == http_request_1 ){
		str[3] = readParameter( data, "character" );
		str[4] = readParameter( data, "image" );
		img.src = SERVER + str[4];
		http_request_1 = null;
	}
	if( request == http_request_2 ){
		var key = readParameters( data );
		str[3] = ("character" in key) ? key["character"] : "";
		str[4] = ("image" in key) ? key["image"] : "";
		img.src = SERVER + str[4];
		http_request_2 = null;
	}
	if( request == http_request_3 ){
		jsonResponse( data );
		str[3] = jsonGetString( 0, "character", "" );
		str[4] = jsonGetString( 0, "image", "" );
		img.src = SERVER + str[4];
		http_request_3 = null;
	}
}
function onHttpError( request, status ){
	str[2] = "通信エラー " + status;
	if( request == http_request_1 ){
		http_request_1 = null;
	}
	if( request == http_request_2 ){
		http_request_2 = null;
	}
	if( request == http_request_3 ){
		http_request_3 = null;
	}
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 127, 127, 127 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.drawScaledImage( img, 160, 0, 480, 480, 0, 0, img.width, img.height );

	g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
	g.setFont( 18, "ＭＳ ゴシック" );

	if(
		(http_request_1 != null) ||
		(http_request_2 != null) ||
		(http_request_3 != null)
	){
		str[2] = "通信中...";
	}

	for( var i = 0; i < 5; i++ ){
		g.drawString( str[i], 0, g.fontHeight() + g.fontHeight() * i );
	}
}

function processEvent( type, param ){
}

function error(){
	launch( "error.html" );
}
