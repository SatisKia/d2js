#include "_Audio.js"
#include "_Graphics.js"
#include "_Main.js"
#include "_Math.js"

window._ANDROID = false;
window._IPHONE = false;
window._SMARTPHONE = false;

var COLOR_BASE_LIGHT;
var COLOR_BASE_FACE;
var COLOR_BASE_SHADOW;
var COLOR_BUTTON_LIGHT;
var COLOR_BUTTON_FACE;
var COLOR_BUTTON_SHADOW;
var COLOR_BUTTON_DSHADOW;
var COLOR_BUTTON_TEXT;
var COLOR_G;
var COLOR_K;
var COLOR_W;

var TYPE = [
	"audio/3gpp",
	"audio/3gpp2",
	"audio/aac",
	"audio/aacp",
	"audio/amr",
	"audio/basic",
	"audio/midi",
	"audio/mp3",
	"audio/mp4",
	"audio/mpeg",
	"audio/ogg",
	"audio/wav",
	"audio/x-aiff",
	"audio/x-wav"
];

var g;

var can_use_audio;
var can_play_type;

var audio;
var audio_pause;
var audio_stop;
var audio_type;
var audio_loop;

function frameTime(){ return 1000 / 15/*フレーム*/; }

function start(){
	var i;

	setCurrent( "canvas0" );

	g = getGraphics();

	g.setStrokeWidth( 2.0 );

	COLOR_BASE_LIGHT     = g.getColorOfRGB( 100, 100, 110 );
	COLOR_BASE_FACE      = g.getColorOfRGB(  60,  60,  90 );
	COLOR_BASE_SHADOW    = g.getColorOfRGB(  20,  20,  30 );
	COLOR_BUTTON_LIGHT   = g.getColorOfRGB( 240, 255, 255 );
	COLOR_BUTTON_FACE    = g.getColorOfRGB( 190, 200, 210 );
	COLOR_BUTTON_SHADOW  = g.getColorOfRGB( 120, 130, 150 );
	COLOR_BUTTON_DSHADOW = g.getColorOfRGB(  90, 100, 120 );
	COLOR_BUTTON_TEXT    = g.getColorOfRGB(  50,  60,  80 );
	COLOR_G              = g.getColorOfRGB(   0, 230,   0 );
	COLOR_K              = g.getColorOfRGB(   0,   0,   0 );
	COLOR_W              = g.getColorOfRGB( 255, 255, 255 );

	can_use_audio = canUseAudio();
	can_play_type = new Array( TYPE.length );
	for( i = 0; i < TYPE.length; i++ ){
		can_play_type[i] = canPlayType( TYPE[i] );
	}

	audio       = new Array( 4 );
	audio_pause = new Array( 4 );
	audio_stop  = new Array( 4 );
	audio_type  = new Array( 4 );
	audio_loop  = new Array( 4 );
	for( i = 0; i < 4; i++ ){
		if( _IPHONE ){
			audio[i] = null;
		} else {
			audio[i] = loadAudio( AUDIO_SRC[i] );
		}
		audio_pause[i] = false;
		audio_stop [i] = false;
		audio_type [i] = can_use_audio ? 0 : 1;
		audio_loop [i] = false;

		addLayout(  20,  95 + 160 * i, 80, 45,     10 * i );
		addLayout( 100,  95 + 160 * i, 80, 45, 1 + 10 * i );
		addLayout( 180,  95 + 160 * i, 80, 45, 2 + 10 * i );
		if( !_SMARTPHONE ){
			addLayout( 270, 100 + 160 * i, 75, 35, 3 + 10 * i );
			addLayout( 345, 100 + 160 * i, 75, 35, 4 + 10 * i );
			addLayout( 420, 100 + 160 * i, 75, 35, 5 + 10 * i );
			addLayout( 495, 100 + 160 * i, 75, 35, 6 + 10 * i );
		}
		addLayout( 495,  30 + 160 * i, 75, 40, 7 + 10 * i );
	}

	return true;
}

function drawTitleWindow( x, y, w, h, str ){
	g.setColor( COLOR_BASE_SHADOW );
	g.fillRect( x, y, w, h );
	g.setColor( COLOR_BASE_LIGHT );
	g.fillRect( x + 1, y + 1, w - 1, h - 1 );
	g.setColor( COLOR_K );
	g.fillRect( x + 1, y + 1, w - 2, h - 2 );
	g.setColor( COLOR_G );
	g.drawString( str, x + 10, (y + h / 2) + (g.fontHeight() / 2) );
}

function drawButton( x, y, w, h, str, down ){
	if( down ){
		g.setColor( COLOR_BUTTON_SHADOW );
		g.fillRect( x, y, w, h );
		g.setColor( COLOR_BUTTON_FACE );
		g.fillRect( x + 2, y + 2, w - 2, h - 2 );
		g.setColor( COLOR_BUTTON_DSHADOW );
		g.fillRect( x, y, w - 2, h - 2 );
		g.setColor( COLOR_BUTTON_SHADOW );
		g.fillRect( x + 2, y + 2, w - 4, h - 4 );
	} else {
		g.setColor( COLOR_BUTTON_FACE );
		g.fillRect( x, y, w, h );
		g.setColor( COLOR_BUTTON_SHADOW );
		g.fillRect( x + 2, y + 2, w - 2, h - 2 );
		g.setColor( COLOR_BUTTON_LIGHT );
		g.fillRect( x, y, w - 2, h - 2 );
		g.setColor( COLOR_BUTTON_FACE );
		g.fillRect( x + 2, y + 2, w - 4, h - 4 );
	}
	g.setColor( COLOR_BUTTON_TEXT );
	g.drawString( str, (x + w / 2) - (g.stringWidth( str ) / 2), (y + h / 2) + (g.fontHeight() / 2) );
}

function paint( g ){
	var i;
	var tmp;

	g.setColor( COLOR_BASE_FACE );
	g.fillRect( 0, 0, 600, 930 );
	g.setColor( COLOR_BASE_SHADOW );
	g.fillRect( 3, 3, 600 - 3, 640 - 3 );
	g.setColor( COLOR_BASE_LIGHT );
	g.fillRect( 0, 0, 600 - 3, 640 - 3 );
	g.setColor( COLOR_BASE_FACE );
	g.fillRect( 3, 3, 600 - 6, 640 - 6 );

	g.setColor( COLOR_BASE_SHADOW );
	g.drawLine( 0, 158, 599, 158 );
	g.drawLine( 0, 318, 599, 318 );
	g.drawLine( 0, 478, 599, 478 );
	g.setColor( COLOR_BASE_LIGHT );
	g.drawLine( 0, 160, 599, 160 );
	g.drawLine( 0, 320, 599, 320 );
	g.drawLine( 0, 480, 599, 480 );

	g.setFont( 24, "ＭＳ Ｐゴシック" );
	g.setColor( COLOR_W );
	g.drawString( "smartphone : " + (_SMARTPHONE ? "true" : "false"), 15, 670 );
	g.drawString( "audio : " + (can_use_audio ? "true" : "false"), 15, 670 + 28 );
	for( i = 2; i < TYPE.length + 2; i++ ){
		g.drawString( TYPE[i - 2] + " : " + (can_play_type[i - 2] ? "true" : "false"), 300 * _DIV( i, 10 ) + 15, 670 + 28 * _MOD(i, 10) );
	}

	g.setFont( 30, "ＭＳ Ｐゴシック" );
	for( i = 0; i < 4; i++ ){
		if( can_use_audio && (audio_type[i] == 0) ){
			drawTitleWindow( 20, 25 + 160 * i, 600 - 140, 50, AUDIO_SRC[i] + " " + getCurrentTime( audio[i] ) );
		} else {
			drawTitleWindow( 20, 25 + 160 * i, 600 - 140, 50, AUDIO_SRC[i] );
		}
	}

	g.setFont( 24, "ＭＳ Ｐゴシック" );
	for( i = 0; i < 4; i++ ){
		if( (tmp = getLayout( 10 * i )) != null ){
			if( audio[i] == null ){
				drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "LOAD", false );
			} else if( (audio_type[i] != 0) || isLoaded( audio[i] ) ){
				if( audio_type[i] == 0 ){
					drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PLAY", isPlaying( audio[i] ) );
				} else {
					drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PLAY", isPlayingEx( audio[i] ) );
				}
			} else {
				if( audio_type[i] == 0 ){
					drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "" + audio[i].element.readyState, false );
				} else {
					drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "", false );
				}
			}
		}
		if( (tmp = getLayout( 1 + 10 * i )) != null ){
			drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "PAUSE", audio_pause[i] );
		}
		if( (tmp = getLayout( 2 + 10 * i )) != null ){
			drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "STOP", audio_stop[i] );
		}
		audio_stop[i] = false;
	}

	if( !_SMARTPHONE ){
		g.setFont( 18, "ＭＳ Ｐゴシック" );
		for( i = 0; i < 4; i++ ){
			if( can_use_audio ){
				if( (tmp = getLayout( 3 + 10 * i )) != null ){
					drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "Audio", audio_type[i] == 0 );
				}
			}
			if( (tmp = getLayout( 4 + 10 * i )) != null ){
				drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "audio", audio_type[i] == 1 );
			}
			if( (tmp = getLayout( 5 + 10 * i )) != null ){
				drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "bgsound", audio_type[i] == 2 );
			}
			if( (tmp = getLayout( 6 + 10 * i )) != null ){
				drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "embed", audio_type[i] == 3 );
			}
		}
	}

	g.setFont( 25, "ＭＳ Ｐゴシック" );
	for( i = 0; i < 4; i++ ){
		if( (tmp = getLayout( 7 + 10 * i )) != null ){
			drawButton( tmp.x, tmp.y, tmp.width, tmp.height, "LOOP", audio_loop[i] );
		}
	}
}

function myStopAudio( i ){
	if( audio_type[i] == 0 ){
		stopAudio( audio[i] );
	} else {
		stopAudioEx( audio[i] );
	}
	audio_pause[i] = false;
}

function processEvent( type, param ){
	if( type == _LAYOUT_DOWN_EVENT ){
		var i = _DIV( param, 10 );
		switch( _MOD( param, 10 ) ){
		case 0:
			if( audio_pause[i] ){
				restartAudio( audio[i] );
				audio_pause[i] = false;
			} else {
				if( audio[i] == null ){
					switch( audio_type[i] ){
					case 0: audio[i] = loadAndPlayAudio( AUDIO_SRC[i], audio_loop[i] ); break;
					case 1: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "audio" ); break;
					case 2: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "bgsound" ); break;
					case 3: audio[i] = loadAndPlayAudioEx( AUDIO_SRC[i], audio_loop[i], "embed" ); break;
					}
				} else if( (audio_type[i] != 0) || isLoaded( audio[i] ) ){
					switch( audio_type[i] ){
					case 0: playAudio( audio[i], audio_loop[i] ); break;
					case 1: playAudioEx( audio[i], audio_loop[i], "audio" ); break;
					case 2: playAudioEx( audio[i], audio_loop[i], "bgsound" ); break;
					case 3: playAudioEx( audio[i], audio_loop[i], "embed" ); break;
					}
				}
			}
			break;
		case 1:
			if( can_use_audio ){
				if( audio_type[i] == 0 ){
					if( audio_pause[i] ){
						restartAudio( audio[i] );
						audio_pause[i] = false;
					} else if( isPlaying( audio[i] ) ){
						pauseAudio( audio[i] );
						audio_pause[i] = true;
					}
				}
			}
			break;
		case 2:
			myStopAudio( i );
			audio_stop[i] = true;
			break;
		case 3:
			if( can_use_audio ){
				myStopAudio( i );
				audio_type[i] = 0;
				audio[i] = loadAudio( AUDIO_SRC[i] );
			}
			break;
		case 4:
			myStopAudio( i );
			audio_type[i] = 1;
			audio[i] = loadAudioEx( AUDIO_SRC[i] );
			break;
		case 5:
			myStopAudio( i );
			audio_type[i] = 2;
			audio[i] = loadAudioEx( AUDIO_SRC[i] );
			break;
		case 6:
			myStopAudio( i );
			audio_type[i] = 3;
			audio[i] = loadAudioEx( AUDIO_SRC[i] );
			break;
		case 7:
			myStopAudio( i );
			audio_loop[i] = !audio_loop[i];
			if( !_SMARTPHONE ){
				reloadAudio( audio[i] );
			}
			break;
		}
	}
}

function error(){
	launch( "error.html" );
}
