#include "_Graphics.js"
#include "_Main.js"
#include "extras\_StringUtil.js"

var util;

var str = "「D2JS」は、DoJa風のアプリの流れ、イベント処理、グラフィック処理で「HTML5 Canvas + JavaScript」アプリを作成できるフレームワークです。「D2JS」は、DoJa風のアプリの流れ、イベント処理、グラフィック処理で「HTML5 Canvas + JavaScript」アプリを作成できるフレームワークです。";

function frameTime(){ return 1000 / 30/*フレーム*/; }

function start(){
	setCurrent( "canvas0" );

	util = new _StringUtil();
	util.setHeadWrap( "!%),.:;?]}¢°’”‰′″℃、。々〉》」』】〕゛゜ゝゞ・ヽヾ！％），．：；？］｝｡｣､･ﾞﾟ￠" );
	util.setEndWrap( "$([\{£¥‘“〈《「『【〔＄（［｛｢￡￥" );

	return true;
}

function paint( g ){
	g.setColor( g.getColorOfRGB( 255, 255, 255 ) );
	g.fillRect( 0, 0, getWidth(), getHeight() );

	g.setFont( 22, "ＭＳ Ｐゴシック" );

	var tmp = util.wrap( str, 200 );
	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( "" + tmp.length + "行", 50, 45 );
	for( i = 0; i < tmp.length; i++ ){
		g.setColor( g.getColorOfRGB( 0, 255, 255 ) );
		g.fillRect( 50, 50 + i * g.fontHeight(), g.stringWidth( tmp[i] ), g.fontHeight() );
		g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
		g.drawString( tmp[i], 50, 50 + (i + 1) * g.fontHeight() );
	}
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawRect( 50, 50, 200, 380 );

	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( util.truncate( str, 300, "..." ), 300, 50 + g.fontHeight() );
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawRect( 300, 50, 300, g.fontHeight() );

	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( util.truncate( str, 200, "…" ), 300, 100 + g.fontHeight() );
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawRect( 300, 100, 200, g.fontHeight() );

	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( util.truncate( str, 100, "・・・" ), 300, 150 + g.fontHeight() );
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawRect( 300, 150, 100, g.fontHeight() );

	g.setColor( g.getColorOfRGB( 0, 0, 255 ) );
	g.drawString( util.truncate( "ABCDEあいうえお", 300, "・・・" ), 300, 200 + g.fontHeight() );
	g.setColor( g.getColorOfRGB( 255, 0, 255 ) );
	g.drawRect( 300, 200, 300, g.fontHeight() );
}

function processEvent( type, param ){
}

function error(){
	launch( "error.html" );
}
